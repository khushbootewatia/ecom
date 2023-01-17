const logger = require("./logger");
class AppError extends Error {
  constructor(
    reference = "Anonymous",
    msg = "Invalid Body!",
    errorCode = 500,
    name = "custom",
    errors = []
  ) {
    super(msg);
    this.name = name;
    this.errors = errors;
    this.errorCode = errorCode;
    this.reference = reference;
  }
}
exports.AppError = AppError;
function errorHandler(error, res) {
  let errorCode = error.errorCode || 500;
  let msg = error.message || null;
  let errors = error.errors || [];
  let reference = error.reference || "Anonymous";
  if (error.name === "MongoServerError" && /^E11000/.test(error.message)) {
    errorCode = 412;
    msg = "Duplicate Key Violates unique constraint";
  } else if (error.name === "BSONTypeError") {
    errorCode = 422;
    msg =
      "Argument passed in ID must be a string of 12 bytes or a string of 24 hex characters";
  } else if (error.name === "CastError") {
    errorCode = 422;
    msg = "Cast to ObjectId failed";
    errors = [JSON.parse(JSON.stringify(error))];
  } else if (error.name === "custom") {
  } else {
    console.log(error, error.message);
    msg = "Server Error!";
  }
  logger.error(
    `Error: {reference: ${reference}, message: ${msg}, errorCode: ${errorCode}, errors: ${JSON.stringify(
      errors
    )}, error: ${error.message}}`
  );
  return res.status(errorCode).json({
    status: false,
    msg,
    errorCode,
    errors,
  });
}
exports.errorHandler = errorHandler;
