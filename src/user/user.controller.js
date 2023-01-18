const bcrypt = require("bcrypt");
const util = require("../../utils/util")
const crypto = require("crypto")
const { User, TransientUser } = require('../user/user.model');
const sendGrid = require("../../services/sendgrid_email")
const { v4: uuidv4 } = require("uuid");
const { AppError } = require("../../utils/errorHandler");




//******************************SIGNUP********************************//

const signUp = async (req, res, next) => {

  try {

    let { name, email, password } = req.body;


    if (!email || !name || !password) {
      throw new AppError(signUp, "fields is required", 400)
    }

    const user = await User.findOne({
      email: email,

    });

    if (user && user.isVerified) throw new AppError(signUp, "User already registered with the same Email id!", 409);
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

    await TransientUser.findOneAndUpdate({ email: email }, { $set: { otpHash: hashedOtp } }, { upsert: true }).then(update => {
      const payload = { to: email, otp }
      sendGrid.sendEmail(payload)
      res.status(200).send({ message: "Otp send successfully!", otp });
    })

  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /user/signup";

    next(error)

  }
}

//********************************VERIFY OTP*********************************//

const verifyOtp = async (req, res, next) => {
  try {
    let { email, otp } = req.body;


    console.log("email", email, "otpHash", otp)

    const transientUser = await TransientUser.findOne({ email })
    // .then(async transientUser => {
    console.log("transientUser", transientUser);
    // console.log("!util.compareHash(otpHash, transientUser.otp)",!util.compareHash(otp, transientUser.otpHash));
    if (!transientUser || !util.compareHash(otp, transientUser.otpHash)) throw new AppError(verifyOtp, "incorrect otp", 401)



    const transientUsers = await TransientUser.findOneAndDelete({ email: email })
    if (transientUsers) {
      let user = await User.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true })
      if (user) {
        const uuserId = uuidv4();
        let user2 = await User.findOneAndUpdate({ email }, { $set: { userId: uuserId } }, { upsert: true })
        if (user2) {
          console.log(user2, "user");
          if (user2 && user2.isVerified) {
            return res.status(200).send({ "message": "otp verified successfully" })
          }

          throw new AppError(verifyOtp, "something went wrong please try again", 400)
        }
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
    const signInUser = await User.findOne({ email: email });
    console.log(signInUser);
    if (!signInUser) {
      throw new AppError(signIn, "Invalid Email", 401)
    }
    if (!signInUser || !util.compareHash(password, signInUser.password))
      throw new AppError(signIn, "Incorrect email or password", 403)
    else {
      console.log(signInUser._id)
      res.send({
        token: util.generateToken({ id: signInUser._id }),
      })
    }
  } catch (error) {
    next(error)
  }
}





//****************************************SIGN OUT******************************************* */






// **************************************FORGET PASSWORD***************************************



const forgetPassword = async (req, res) => {
  const { email } = req.body;
  await User.findOne({ email: email }, (err, user) => {
    console.log(user);
    if (err) {
      res.status(500).json({ message: err });
    } else if (!user) {
      throw new AppError(forgetPassword,"User not found",401 );
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


const resetPassword = async (req, res) => {
  const { password } = req.body;
  let { token } = req.params;
  // console.log(User);
  // console.log(token);
  User.findOne({ resetPasswordToken: token }, (err, user) => {

    if (err) {
      res.status(500).json({ message: err });
    } else if (!user) {
      res.status(404).json({ message: "Password reset token is invalid or has expired." });
    } else {
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

//*****************************************CHANGE PASSWORD********************************** *//

module.exports = { signUp, verifyOtp, signIn, forgetPassword, resetPassword }