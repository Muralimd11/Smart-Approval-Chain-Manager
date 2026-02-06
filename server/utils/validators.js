const { body } = require('express-validator');

exports.registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['employee', 'teamlead', 'manager']).withMessage('Invalid role')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.purchaseRequestValidation = [
  body('productName').notEmpty().withMessage('Product name is required'),
  body('marketPrice').isNumeric().withMessage('Market price must be a number'),
  body('reason').notEmpty().withMessage('Reason is required')
];

exports.expenseRequestValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').optional()
];

exports.leaveRequestValidation = [
  body('fromDate').isISO8601().withMessage('Valid from date is required'),
  body('toDate').isISO8601().withMessage('Valid to date is required'),
  body('reason').notEmpty().withMessage('Reason is required')
];
