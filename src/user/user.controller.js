const bcrypt = require("bcryptjs");
// const AppError = require("../errorHandler/appError")
const util = require("../../utils/util")
const crypto = require("crypto")
const { User, TransientUser } = require('../user/user.model');
const sendGrid = require("../../services/sendgrid_email")




//******************************SIGNUP********************************//

module.exports.signUp = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    // console.log(req.body);


    if (!email) {
      throw new AppError("Email is required", 400)
    }
    const user = await User.findOne({
      email: email,

    });

    if (user && user.isVerified) return res.status(400).send({ "message": "User already registered!" });
    if (!user) {
      password = util.generateHash(password)
      User.create({
        name, email, password
      })
    }
    //otp generate
    const otp = util.generateOtp();

    // console.log(OTP);


    console.log(otp);

    const hashedOtp = util.generateHash(otp)


    await TransientUser.create({ email: email, otp: hashedOtp });
    const payload = { to: email, subject: "verification Email" }
    // sendGrid.sendEmail(payload)
    res.status(200).send({ message: "Otp send successfully!", otp });
  } catch (error) {
    next(error)
  }

}

//********************************VERIFY OTP*********************************//

module.exports.verifyOtp = (req, res) => {
  let { email, otp } = req.body;
  // console.log("email", email);
  TransientUser.findOne({ email })
    .then(transientUser => {
      if (!transientUser || !util.compareHash(otp, transientUser.otp)) return res.status(200).send({ "message": "incorrect otp" })
      return User.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true })
    })
    .then(user => {
      console.log(user, "user");
      if (user && user.isVerified)
        return res.status(200).send({ "message": "otp verified successfully" })
      throw new AppError("something went wrong please try again", 400)

    })
    .catch(err => {
      throw err
    })
}

// ******************************** SIGN IN ***********************************

module.exports.signin = async (req, res) => {
  const { email, password } = req.body

  const signinUser = await User.findOne({ email });
  if (!signinUser || !util.compareHash(password, signinUser.password)) return res.status(200).send({ "message": "incorrect email or password" })
  // console.log(signinUser,"sp");
  if (!signinUser) {
    // res.status(401).send({message: 'Invalid Email or Password',});
    throw new AppError("Invalid Email or Password", 401)
  } else {
    res.send({
      token: util.generateToken({ email }),
    });
  }
}




// **************************************FORGET PASSWORD***************************************



module.exports.forgetPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }, (err, user) => {
    console.log(user);
    if (err) {
      res.status(500).json({ message: err });
    } else if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      // Generate and set a password reset token
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // expires in 1 hour
      user.save((err) => {
        if (err) {
          res.status(500).json({ message: err });
        } else {
          // Send the password reset email
          const payload = { to: email, resetToken: resetToken, subject: "verification Email" }
          sendGrid.sendEmailForResetPassword(payload)
          res.status(200).send({ message: "Link send successfully!" });


        }
      });
    }
  });
}

// *************************************RESET PASSWORD************************************


module.exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  let { token } = req.params;
  // console.log(User);
  // console.log(token);
  User.findOne({ resetPasswordToken: token}, (err, user) => {

    if (err) {
      res.status(500).json({ message: err });
    } else if (!user) {
      res.status(404).json({ message: "Password reset token is invalid or has expired." });
    } else {
      // console.log(user);
      user.password = util.generateHash(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.save((err) => {
        if (err) {
          res.status(500).json({ message: err });
        } else {
          res.status(200).json({ message: "Password reset successful." });
        }
      });
      
    }
  });
};

//*****************************************CHANGE PASSWORD********************************** */
