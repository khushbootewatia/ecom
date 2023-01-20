const bcrypt = require("bcrypt");
const util = require("../../utils/util")
const crypto = require("crypto")
const { User, TransientUser } = require('../user/user.model');
const sendGrid = require("../../services/sendgrid_email")
const{
getUser,
updateUser,
getTransisentUser,
updateTransisentUser,
removeTransisentUser
} = require("../user/user.service")

const { AppError } = require("../../utils/errorHandler");




//******************************SIGNUP********************************//

const signUp = async (req, res, next) => {
  try {

    let { name, email, password } = req.body;

    if (!email || !name || !password) {
      throw new AppError("signUp", "fields is required", 400)
    }
   
    const user = await User.findOne({
      email: email,

    if (user && user.isVerified) throw new AppError("signUp", "User already registered with the same Email id!", 409);
    if (!user) {
      password = util.generateHash(password)
      await User.create({
        name, email, password
      })
    }
    //otp generate

    const otp = util.generateOtp();

    


    console.log(otp);
    const hashedOtp = util.generateHash(otp)
    console.log(hashedOtp);

    await TransientUser.findOneAndUpdate({ email: email}, {$set:{otpHash: hashedOtp }},{upsert:true}).then(update=>{
      const payload = { to: email,otp}
    sendGrid.sendEmail(payload)
    res.status(200).send({ message: "Otp send successfully!", otp });
    })

  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /user/signup";

    next(error)

  }
}


//********************************VERIFY OTP*********************************//

module.exports.verifyOtp = (req, res) => {
  let { email, otp } = req.body;
  
  
  console.log("email", email,"otpHash",otp)


  TransientUser.findOne({ email })
    .then( transientUser => {
      console.log("transientUser",!transientUser);
      // console.log("!util.compareHash(otpHash, transientUser.otp)",!util.compareHash(otp, transientUser.otpHash));
      if (!transientUser || !util.compareHash(otp, transientUser.otpHash)) return res.status(200).send({ "message": "incorrect otp" })
      
      return TransientUser.findOneAndDelete({email:email}).then(value=>{
        return User.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true })}).then(data=>{
          const uuserId=uuidv4();
          return User.findOneAndUpdate({ email },  {$set:{userId: uuserId }},{upsert:true})
        })
      
      .then(user => {
        console.log(user, "user");
        if (user && user.isVerified)
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
  const hashedEmail = util.generateHash(email)
  console.log("HE -->  ",hashedEmail);
  const signinUser = await User.findOne({ email });
  if (!signinUser || !util.compareHash(password, signinUser.password))
    throw new AppError("Incorrect email or password")
  if (!signinUser) {
    throw new AppError("Invalid Email or Password", 401)
  } else {
    res.send({
      token: util.generateToken({hashedEmail}),
    });
  }
}





//****************************************SIGN OUT******************************************* */






// **************************************FORGET PASSWORD***************************************



const forgetPassword = async (req, res, next) => {
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
  // console.log(User);
  // console.log(token);
  User.findOne({ resetPasswordToken: token }, (err, user) => {

  try {
    const user = await getUser({ resetPasswordToken: token })
    if (!user) {
      throw new AppError(resetPassword, "Password reset token is invalid or has expired.", 401);
    } else {
     user.password = util.generateHash(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save()
          res.status(200).json({ message: "Password reset successful." });
        }
      }


  

  catch (error) {
    error.reference = error.reference ? error.reference : "POST /user/forgetPassword";

    next(error);
  }

};

//*****************************************CHANGE PASSWORD********************************** *//

module.exports = { signUp, verifyOtp, signIn, forgetPassword, resetPassword }