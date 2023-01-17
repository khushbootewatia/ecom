const jwt = require('jsonwebtoken');
const Admin = require('./admin.model')

exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      return next("Please Login to access this resource", 401);
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    user = await Admin.findById(decodedData.id);
    next();
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
        );
      }
      next();
    };
  };