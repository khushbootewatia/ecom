const bcrypt = require("bcrypt");
const util = require("../../utils/util")
const crypto = require("crypto")
const { User, TransientUser } = require('../user/user.model');
const sendGrid = require("../../services/sendgrid_email")

const { AppError } = require("../../utils/errorHandler");



//******************************SIGNUP********************************//

const signUp = async (req, res, next) => {
  try {

    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      throw new AppError("signUp", "fields is required", 400)
    }

    const user = await User.findOne({ email });

    if (user && user.isVerified) throw new AppError("signUp", "User already registered with the same Email id!", 409);
    if (!user) {
      password = util.generateHash(password)
      await User.create({
        name, email, password
      })
    }
    const otp = util.generateOtp();
    const hashedOtp = util.generateHash(otp)
    await TransientUser.findOneAndUpdate({ email: email }, { $set: { otpHash: hashedOtp } }, { upsert: true }).then(update => { //TODO: move otp related functions to otp module
      const payload = { to: email, otp }
      sendGrid.sendEmail(payload)
      res.status(200).send({ "message": "Otp send successfully!" });
    })

  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /user/signup";

    next(error)

  }
}


//********************************VERIFY OTP*********************************//

const verifyOtp = async (req, res, next) => { //TODO: move this function to otp module
  try {
    const { email, otp } = req.body;
    const transientUser = await TransientUser.findOne({ email }) //TODO: move this to otp service
    if (!transientUser || !util.compareHash(otp, transientUser.otpHash)) throw new AppError(verifyOtp, "incorrect otp", 401)
    const transientUsers = await TransientUser.findOneAndDelete({ email: email })
    if (transientUsers) {
      let user = await User.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true })
      if (user) {
      
          if (user && user.isVerified) {
            return res.status(200).send({ "message": "otp verified successfully" })
          }
          throw new AppError(verifyOtp, "something went wrong please try again", 400)
        }
      }
    }

  
  catch (error) {
    error.reference = error.reference ? error.reference : "POST /user/verifyOtp";
    next(error);
  }


}


// ******************************** SIGN IN ***********************************

const signIn = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const signInUser = await User.findOne({ email });
    console.log(signInUser);
    if (!signInUser) {
      throw new AppError("signIn", "Invalid Email", 401)
    }
    if (!signInUser || !util.compareHash(password, signInUser.password))
      throw new AppError("signIn", "Incorrect email or password", 403)
    else {
      console.log(signInUser._id)
      res.json({
        token: util.generateToken({ id: signInUser._id }), 
      })
    }
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /user/signIn";

    next(error)
  }
}





//****************************************SIGN OUT******************************************* */






// **************************************FORGET PASSWORD***************************************



const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }) 

    if (!user) {
      throw new AppError(forgetPassword, "User not found", 401);
    }
    if (user) {
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // expires in 1 hour
      await user.save()
      const payload = { to: email, resetToken: resetToken, subject: "verification Email" }
      sendGrid.sendEmailForResetPassword(payload)
      res.status(200).json({ message: "Link send successfully!" }); 
    }

  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /user/forgetPassword";

    next(error); 
  }
};


// *************************************RESET PASSWORD************************************


const resetPassword = async (req, res, next) => {
  const { password } = req.body;

  let { token } = req.params;

  try {
    const user = await User.findOne({ resetPasswordToken: token })
    if (!user) {
      throw new AppError(resetPassword, "Password reset token is invalid or has expired.", 401);
    } else {
      user.password = util.generateHash(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.save((err) => { //TODO: avoid using callbacks
        if (err) {
          res.status(500).json({ message: err }); //FIXME: error should be handled with global error handler
        } else {
          res.status(200).json({ message: "Password reset successful." });
        }
      });

    }
  }

  catch (error) {
    error.reference = error.reference ? error.reference : "POST /user/forgetPassword";

    next(error);
  }

};

//*****************************************CHANGE PASSWORD********************************** *//

module.exports = { signUp, verifyOtp, signIn, forgetPassword, resetPassword }