const { body } = require('express-validator');

const registerValidator = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('monthly_income')
        .isFloat({ min: 1200 })
        .withMessage('Monthly income must be greater than $1200')
];

const loginValidator = [
    body('username')
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

module.exports = {
    registerValidator,
    loginValidator
};