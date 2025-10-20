const db = require('../database/db');
const crypto = require('crypto');

const Payment = {
    create: async (paymentData, transaction = db) => {
        
        const transactionId = crypto.randomBytes(8).toString('hex');
        
        const [id] = await transaction('payments').insert({
            loan_id: paymentData.loan_id,
            user_id: paymentData.user_id,
            amount: paymentData.amount,
            payment_method: paymentData.payment_method,
            transaction_id: transactionId
        });
        
        return { id, ...paymentData, transaction_id: transactionId };
    },
    
    findById: async (id) => {
        return await db('payments').where({ id }).first();
    },
    
    findByLoanId: async (loanId) => {
        return await db('payments').where({ loan_id: loanId });
    },
    
    findByUserId: async (userId) => {
        return await db('payments').where({ user_id: userId });
    }
};

module.exports = Payment;