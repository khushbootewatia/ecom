const logger = require('./logger')

const errors = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    logger.error(`${statusCode} - ${err.message}`)
    console.log("errors", logger.error(`${statusCode} - ${err.message}`));
    res.status(statusCode).json({
        success: 0,
        message: err.message,
        stack: err.stack
    })
}

module.exports = errors