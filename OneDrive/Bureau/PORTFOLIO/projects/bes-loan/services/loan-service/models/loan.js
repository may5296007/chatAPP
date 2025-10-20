const db = require('../database/db');

const Loan = {
    create: async (loanData) => {
        const [id] = await db('loans').insert({
            user_id: loanData.user_id,
            amount: loanData.amount,
            remaining_amount: loanData.amount, // Initially the same as amount
            purpose: loanData.purpose,
            loan_date: new Date().toISOString().split('T')[0],
            due_date: loanData.due_date,
            status: 'pending'
        });
        
        return { id, ...loanData };
    },
    
    findById: async (id) => {
        return await db('loans').where({ id }).first();
    },
    
    findByUserId: async (userId) => {
        return await db('loans').where({ user_id: userId });
    },

    countActiveLoans: async (userId) => {
        return await db('loans')
            .where({ user_id: userId })
            .whereIn('status', ['pending', 'approved', 'active'])
            .count('id as count')
            .first()
            .then(result => result.count);
    },
    
    updateStatus: async (loanId, status) => {
        await db('loans')
            .where({ id: loanId })
            .update({ status });
        
        return await Loan.findById(loanId);
        },
    
    // Dans loan-service/models/loan.js
    updateRemainingAmount: async (loanId, amount) => {
    console.log(`Starting updateRemainingAmount for loan ${loanId}, amount: ${amount}`);
    
    const loan = await Loan.findById(loanId);
    if (!loan) {
        console.error('Loan not found');
        throw new Error('Loan not found');
    }
    
    console.log('Current loan remaining amount:', loan.remaining_amount);
    const currentRemaining = parseFloat(loan.remaining_amount);
    const paymentAmount = parseFloat(amount);
    const newRemainingAmount = currentRemaining - paymentAmount;
    console.log('New remaining amount calculation:', currentRemaining, '-', paymentAmount, '=', newRemainingAmount);
    
    const status = newRemainingAmount <= 0 ? 'paid' : 'active';
    console.log('New status will be:', status);
    
    // Vérifiez que cette requête SQL s'exécute correctement
    const updateResult = await db('loans')
        .where({ id: loanId })
        .update({ 
        remaining_amount: Math.max(0, newRemainingAmount),
        status
        });
    console.log('Database update result:', updateResult);
    
    const updatedLoan = await Loan.findById(loanId);
    console.log('Updated loan from database:', updatedLoan);
    return updatedLoan;
    }
};

module.exports = Loan;