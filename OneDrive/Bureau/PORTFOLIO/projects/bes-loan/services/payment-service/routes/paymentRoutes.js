const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/payment');
const authMiddleware = require('../middlewares/auth');
const transactionMiddleware = require('../middlewares/transaction');
const axios = require('axios');

const router = express.Router();


router.post('/', [authMiddleware, transactionMiddleware], async (req, res) => {
  try {
    const userId = req.user.id;
    const { loan_id, amount, payment_method } = req.body;
    
    // Vérifier que le montant est valide
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }
    
    
    if (!loan_id || isNaN(loan_id)) {
      return res.status(400).json({ error: 'Valid loan ID is required' });
    }
    
    
    if (!payment_method || !['credit_card', 'debit_card', 'bank_transfer'].includes(payment_method)) {
      return res.status(400).json({ error: 'Valid payment method is required' });
    }
    
    console.log(`Traitement du paiement : loan_id=${loan_id}, amount=${amount}, payment_method=${payment_method}`);
    
    
    const payment = await Payment.create({
      loan_id,
      user_id: userId,
      amount,
      payment_method
    }, req.trx);
    
    console.log(`Paiement créé avec succès, ID: ${payment.id}`);
    
    
    try {
      console.log(`Mise à jour du montant restant du prêt ${loan_id}`);
      

      const loanUpdateResponse = await axios.put(
        `http://localhost:3002/api/loans/${loan_id}/payment`,
        { amount },
        { headers: { Authorization: `Bearer ${req.token || req.headers.authorization}` } }
      );
      
      console.log('Prêt mis à jour avec succès:', loanUpdateResponse.data);
      
      
      res.status(201).json(payment);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prêt:', error);
      
      
      res.status(500).json({ 
        error: 'Le paiement a été enregistré, mais la mise à jour du prêt a échoué',
        payment
      });
    }
  } catch (error) {
    console.error('Erreur de paiement:', error);
    res.status(500).json({ error: 'Erreur serveur lors du traitement du paiement' });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.findByUserId(userId);
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des paiements' });
  }
});


router.get('/loan/:loanId', authMiddleware, async (req, res) => {
  try {
    const loanId = req.params.loanId;
    const payments = await Payment.findByLoanId(loanId);
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des paiements du prêt' });
  }
});

module.exports = router;