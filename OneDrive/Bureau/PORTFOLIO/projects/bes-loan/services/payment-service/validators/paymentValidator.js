const { body } = require('express-validator');

const createPaymentValidator = [
    body('loan_id')
        .isInt({ min: 1 })
        .withMessage('Valid loan ID is required'),
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Payment amount must be greater than 0'),
    body('payment_method')
        .isIn(['credit_card', 'debit_card', 'bank_transfer'])
        .withMessage('Payment method must be credit_card, debit_card, or bank_transfer')
];

module.exports = {
    createPaymentValidator
};