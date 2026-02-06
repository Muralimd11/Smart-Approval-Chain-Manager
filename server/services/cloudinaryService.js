const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Upload PDF
exports.uploadPDF = (fileBuffer, folder = 'requests', originalFilename = null) => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured with VALID credentials (not defaults)
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

    if (isCloudinaryConfigured) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'raw',
          format: 'pdf',
          public_id: originalFilename ? originalFilename.split('.')[0] : undefined
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    } else {
      // Local storage fallback
      // Create a unique filename while preserving original name if provided
      let fileName;
      if (originalFilename) {
        // Sanitize filename: remove spaces and special chars, keep extension
        const sanitized = originalFilename.replace(/[^a-zA-Z0-9.]/g, '_');
        fileName = `${Date.now()}_${sanitized}`;
      } else {
        fileName = `${crypto.randomUUID()}.pdf`;
      }

      const uploadPath = path.join(__dirname, '../public/uploads', fileName);

      // Ensure directory exists
      const dir = path.dirname(uploadPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFile(uploadPath, fileBuffer, (err) => {
        if (err) {
          reject(err);
        } else {
          // Construct local URL
          const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
          resolve({
            url: `${baseUrl}/uploads/${fileName}`,
            publicId: `local_${fileName}`
          });
        }
      });
    }
  });
};

// Delete file
exports.deleteFile = async (publicId) => {
  try {
    if (publicId && publicId.startsWith('local_')) {
      // Local deletion logic
      const fileName = publicId.replace('local_', '');
      const filePath = path.join(__dirname, '../public/uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { result: 'ok' };
    } else if (publicId) {
      // Cloudinary deletion
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw'
      });
      return result;
    }
  } catch (error) {
    console.error('File deletion error:', error);
    // Don't throw error for local files if not found, just ignore
    if (publicId && publicId.startsWith('local_')) return { result: 'ignored' };
    throw error;
  }
};