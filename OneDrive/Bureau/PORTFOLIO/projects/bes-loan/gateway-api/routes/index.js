const express = require('express');
const axios = require('axios');
const router = express.Router();


router.post('/auth/register', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/register', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/login', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
    }
});


router.post('/loans', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:3002/api/loans', req.body, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
    }
});

router.get('/loans', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3002/api/loans', {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
    }
});

router.get('/loans/:id', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:3002/api/loans/${req.params.id}`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
    }
});


router.post('/payments', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:3003/api/payments', req.body, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
    }
});

router.get('/payments', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3003/api/payments', {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
    }
});

router.get('/payments/loan/:loanId', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:3003/api/payments/loan/${req.params.loanId}`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
    }
});

router.put('/loans/:id/status', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:3002/api/loans/${req.params.id}/status`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
  }
});

router.put('/loans/:id/payment', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:3002/api/loans/${req.params.id}/payment`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway Error' });
  }
});

module.exports = router;