const jwt = require("jsonwebtoken")
const {User} = require("../user/user.model");

exports.isAuthenticatedUser = async (req, res, next) => {
  const {token} = req.headers
  console.log(token);
  if (!token) {
    return res.json({
      success: false,
      Message : "Please login to access this route",
    });
    console.log("not running")
  } 

  const decodedData = jwt.verify(token, "asdgcsvdcgvsgcv")
  console.log(decodedData)
  
  const userData = await User.findOne({email: decodedData.email})

  req.user = userData 

  next()
};
