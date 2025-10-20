const db = require('../database/db');
const bcrypt = require('bcrypt');

const User = {
    findByUsername: async (username) => {
        return await db('users').where({ username }).first();
    },
    
    findById: async (id) => {
        return await db('users').where({ id }).first();
    },
    
    create: async (userData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const [id] = await db('users').insert({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            monthly_income: userData.monthly_income
        });
        
        return { id, ...userData, password: undefined };
    },
    
    validatePassword: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
};

module.exports = User;