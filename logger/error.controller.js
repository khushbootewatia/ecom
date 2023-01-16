const logger = require("./logger")

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    logger.error(`${statusCode} - ${err.message}`)
    res.status(statusCode).json({
        success: 0,
        message: err.message,
        stack: err.stack
    })
}