const express = require('express');
const { body, validationResult } = require('express-validator');
const Loan = require('../models/loan');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, purpose, due_date } = req.body;
    
    
    if (amount > 5000) {
      return res.status(400).json({ 
        error: 'Loan amount cannot exceed $5000' 
      });
    }
    
    if (amount < 100) {
      return res.status(400).json({ 
        error: 'Loan amount must be at least $100' 
      });
    }
    
    
    const dueDate = new Date(due_date);
    const today = new Date();
    
    if (dueDate <= today) {
      return res.status(400).json({ 
        error: 'Due date must be after today' 
      });
    }
    
    // Maximum loan duration its 2 years
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    
    if (dueDate > twoYearsFromNow) {
      return res.status(400).json({ 
        error: 'Due date cannot be more than 2 years from now' 
      });
    }
    
    // Vérifier si l'utilisateur a trop de prêts actifs
    const activeLoansCount = await Loan.countActiveLoans(userId);
    if (activeLoansCount >= 3) {
      return res.status(400).json({ 
        error: 'You cannot have more than 3 active loans at once' 
      });
    }
    
    // Vérifier si le revenu mensuel est suffisant
    if (req.user.monthly_income < 1200) {
      return res.status(400).json({
        error: 'Your monthly income must be at least $1200 to request a loan'
      });
    }
    
    
    const loan = await Loan.create({
      user_id: userId,
      amount,
      purpose,
      due_date
    });
    
    res.status(201).json(loan);
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ error: 'Server error during loan creation' });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const loans = await Loan.findByUserId(userId);
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching loans' });
  }
});


router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    
    
    if (loan.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this loan' });
    }
    
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching loan' });
  }
});


router.put('/:id/payment', authMiddleware, async (req, res) => {
  try {
    const loanId = req.params.id;
    const { amount } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }
    
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    
    
    if (loan.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this loan' });
    }
    
    
    if (loan.status !== 'active' && loan.status !== 'approved') {
      return res.status(400).json({ 
        error: 'Payment can only be made on active or approved loans' 
      });
    }
    
    
    const updatedLoan = await Loan.updateRemainingAmount(loanId, amount);
    
    res.json(updatedLoan);
  } catch (error) {
    res.status(500).json({ error: 'Server error processing loan payment' });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const loanId = req.params.id;
    const { status } = req.body;
    
    if (!status || !['pending', 'approved', 'active', 'paid'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }
    
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    
    
    if (loan.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this loan' });
    }
    
    
    const updatedLoan = await Loan.updateStatus(loanId, status);
    
    res.json(updatedLoan);
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ error: 'Server error updating loan status' });
  }
});
module.exports = router;