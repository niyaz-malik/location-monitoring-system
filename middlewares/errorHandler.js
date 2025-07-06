const customError = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
    if (err instanceof customError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        stack: err.stack,
    });
};

module.exports = errorHandler;
