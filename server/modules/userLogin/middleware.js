const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error details
    res.status(500).json({ error: err.message || 'Internal server error' });
  };
  
  module.exports = errorHandler;
  