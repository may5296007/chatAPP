// loan-service/middlewares/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bes-loan-secret-key';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Mocked user for testing
      req.user = {
        id: decoded.id || 1,
        username: 'testuser',
        email: 'test@example.com',
        monthly_income: 3500
      };
      
      req.token = token;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;