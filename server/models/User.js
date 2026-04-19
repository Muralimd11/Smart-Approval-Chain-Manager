const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['employee', 'teamlead', 'manager', 'admin'],
    default: 'employee'
  },
  department: {
    type: String,
    trim: true
  },
  signaturePin: {
    type: String,
    select: false
  },
  pinResetToken: String,
  pinResetExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  if (this.isModified('signaturePin') && this.signaturePin) {
    const salt = await bcrypt.genSalt(10);
    this.signaturePin = await bcrypt.hash(this.signaturePin, salt);
  }
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare signature PIN
userSchema.methods.matchSignaturePin = async function (enteredPin) {
  if (!this.signaturePin) return false;
  return await bcrypt.compare(enteredPin, this.signaturePin);
};

module.exports = mongoose.model('User', userSchema);
