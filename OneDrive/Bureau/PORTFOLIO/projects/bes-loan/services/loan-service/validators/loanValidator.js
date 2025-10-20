const { body } = require('express-validator');

const createLoanValidator = [
    body('amount')
        .isFloat({ min: 100, max: 5000 })
        .withMessage('Loan amount must be between $100 and $5000'),
    body('purpose')
        .isLength({ min: 5, max: 200 })
        .withMessage('Loan purpose must be between 5 and 200 characters'),
    body('due_date')
        .isDate()
        .withMessage('Due date must be a valid date')
        .custom((value) => {
            const dueDate = new Date(value);
            const today = new Date();
            
            if (dueDate <= today) {
                throw new Error('Due date must be after today');
            }
            
            // Maximum loan duration is 2 years
            const twoYearsFromNow = new Date();
            twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
            
            if (dueDate > twoYearsFromNow) {
                throw new Error('Due date cannot be more than 2 years from now');
            }
            
            return true;
        })
];

module.exports = {
    createLoanValidator
};