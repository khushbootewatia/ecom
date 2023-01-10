const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../config")


module.exports.generateOtp = () => {
  return Math.floor(Math.pow(10, 3) + Math.random() * 9000)
}

module.exports.generateHash = (data) => {
  return bcrypt.hashSync(String(data), 10)
}

module.exports.compareHash = (data, hash) => {
  return bcrypt.compareSync(data, hash)
}

module.exports.generateToken = (userObject) => {
  let expireTime;
  expireTime = 6 * 30 * config.cfg.tokenExpirationTime; //6 months

  return jwt.sign(userObject, config.cfg.jwtSecretKey, { expiresIn: expireTime })

}

module.exports.signout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};



// **************************************API ERROR HANDLER**********************************

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
