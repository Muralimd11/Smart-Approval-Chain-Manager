const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Check if credentials are missing
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.log('[DEBUG] No email credentials provided. Skipping actual email send.');
    console.log(`[DEBUG] Email would be sent to: ${options.email}`);
    console.log(`[DEBUG] Subject: ${options.subject}`);
    console.log(`[DEBUG] Message:\n${options.message}`);
    return;
  }

  // Define email options
  const message = {
    from: `${process.env.EMAIL_FROM_NAME || 'Smart Approval Chain'} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
