const db = require('../database/db');

const transactionMiddleware = async (req, res, next) => {
  // Start a transaction
  const trx = await db.transaction();
  req.trx = trx;
  
  // Capture the original response methods
  const originalJson = res.json;
  const originalStatus = res.status;
  let statusCode = 200;
  
  // Override status method
  res.status = function(code) {
    statusCode = code;
    return originalStatus.apply(this, arguments);
  };
  
  // Override json method
  res.json = function(data) {
    if (statusCode >= 200 && statusCode < 300) {
      // Success, commit the transaction
      trx.commit()
        .then(() => {
          console.log('Transaction committed successfully');
          originalJson.call(this, data);
        })
        .catch(err => {
          console.error('Transaction commit error:', err);
          trx.rollback();
          originalStatus.call(this, 500);
          originalJson.call(this, { error: 'Transaction failed' });
        });
    } else {
      // Error, rollback the transaction
      trx.rollback()
        .then(() => {
          console.log('Transaction rolled back due to error');
          originalJson.call(this, data);
        })
        .catch(err => {
          console.error('Transaction rollback error:', err);
          originalJson.call(this, data);
        });
    }
  };
  
  next();
};

module.exports = transactionMiddleware;