const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Check if Team Lead or Manager already exists for this department
    if (role === 'teamlead' || role === 'manager') {
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Department is required for Team Lead and Manager roles'
        });
      }

      const existingRoleUser = await User.findOne({ role, department });
      if (existingRoleUser) {
        return res.status(400).json({
          success: false,
          message: `${role === 'teamlead' ? 'Team Lead' : 'Manager'} already exists for the ${department} department`
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee',
      department
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        hasSignaturePin: false, // newly registered user has no PIN yet
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password +signaturePin');

    if (!user) {
      console.log(`[DEBUG] Login failed: User ${email} not found`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log(`[DEBUG] Login attempt for ${email}: Match=${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        hasSignaturePin: !!user.signaturePin,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+signaturePin');

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        hasSignaturePin: !!user.signaturePin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ role: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update signature PIN
// @route   PUT /api/auth/signature-pin
// @access  Private
exports.updateSignaturePin = async (req, res) => {
  try {
    const { signaturePin, oldPin } = req.body;

    if (!signaturePin || signaturePin.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid signature PIN (at least 4 characters)'
      });
    }

    const user = await User.findById(req.user.id).select('+password +signaturePin');
    
    // If user already has a PIN, verify the old one before updating
    if (user.signaturePin) {
      if (!oldPin) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your current Signature PIN to update it'
        });
      }
      
      const isMatch = await user.matchSignaturePin(oldPin);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current Signature PIN'
        });
      }
    }

    user.signaturePin = signaturePin;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Signature PIN updated successfully',
      hasSignaturePin: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Forgot signature PIN
// @route   POST /api/auth/forgot-signature-pin
// @access  Private
exports.forgotSignaturePin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to pinResetToken field
    user.pinResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.pinResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url (we assume frontend is running on localhost:3000 in dev or the origin)
    const resetUrl = `${req.headers.origin || 'http://localhost:3000'}/reset-signature-pin/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of your Signature PIN.\n\nPlease go to this link to reset it: \n\n${resetUrl}\n\nThis link will expire in 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Signature PIN Reset Token',
        message
      });

      res.status(200).json({ success: true, message: 'Email sent! Check your inbox or terminal.' });
    } catch (err) {
      console.log('Error sending email:', err);
      user.pinResetToken = undefined;
      user.pinResetExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset signature PIN
// @route   PUT /api/auth/reset-signature-pin/:token
// @access  Public
exports.resetSignaturePin = async (req, res) => {
  try {
    const resetToken = req.params.token;

    // Get hashed token
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      pinResetToken: resetTokenHash,
      pinResetExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Set new pin
    const { signaturePin } = req.body;
    if (!signaturePin || signaturePin.length < 4) {
      return res.status(400).json({ success: false, message: 'Please provide a valid signature PIN (at least 4 characters)' });
    }

    user.signaturePin = signaturePin;
    user.pinResetToken = undefined;
    user.pinResetExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Signature PIN reset successfully. You can now use your new PIN.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

