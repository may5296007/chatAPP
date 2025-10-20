const express = require('express');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const { registerValidator, loginValidator } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { username, email, password, monthly_income } = req.body;
        
        
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        
        const user = await User.create({ username, email, password, monthly_income });
        
        
        const token = generateToken(user.id);
        
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login route
router.post('/login', loginValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { username, password } = req.body;
        
        
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        
        const isPasswordValid = await User.validatePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        
        const token = generateToken(user.id);
        
        res.json({ 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                monthly_income: user.monthly_income
            }, 
            token 
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;