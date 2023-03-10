const bcrypt = require("bcrypt");
const util = require("../../utils/util")
const crypto = require("crypto")
const { User, TransientUser } = require('../user/user.model');
const sendGrid = require("../../services/sendgrid_email")
const { v4: uuidv4} = require("uuid");
const { AppError } = require("../../utils/errorHandler");




//******************************SIGNUP********************************//

module.exports.signUp = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    // console.log(req.body);

    if (!email||!name||!password) {
      throw new AppError("fields is required", 400)
    }
   
    const user = await User.findOne({
      email: email,

    });

    if (user && user.isVerified) return res.status(400).send({ "message": "User already registered with the same Email id!" });
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

        throw new AppError("something went wrong please try again", 400)

      })
      .catch(err => {
        throw err
      })
    })
    .catch(err => {
      throw err
    })
    
}

// ******************************** SIGN IN ***********************************

module.exports.signin = async (req, res) => {
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


// module.exports.changePassword = async (req, res) => {
//   const { email, password, newPassword } = req.body;
//   const user = await User.findOne({
//     email
//   });
//   // if(!user)
// }

// module.exports.forgetPasswordFunc = async (req, res) => {
//   console.log("Coming here")
//   let { email } = req.body;
//   console.log(email)
//   try {
//     console.log(User)
//     const value = await User.findOne({ email });
//     console.log(User, value)
//     const otp = util.generateOtp();
//     const hashedOtp = util.generateHash(otp);
//     try {
//       const findingOtpInForget = await forgetUser.findOne({ email })
//       console.log(findingOtpInForget)
//       if (findingOtpInForget) {
//         console.log("User found")
//         findingOtpInForget.otp = hashedOtp
//       } else {
//         console.log("user created");
//         await forgetUser.create({ email: req.body.email, otp: hashedOtp });
//       }

//     } catch (err) {
//       console.log(err);
//     }

//     const payload = { to: email, subject: otp };
//     const mailing = async (req, res) => {
//       await sendMailer(payload);
//     };

//     mailing();
//     res.status(200).send({ message: "Otp send successfully!", otp });
//   } catch (err) {
//     res.send("Email not registered");
//   }
// };

// module.exports.verifyChangedOtp = async (req, res) => {
//   let { email, otp, newPassword } = req.body;
//   const verifyingOtp = await forgetUser.findOne({ email });
//   console.log(req.body)
//   console.log(verifyingOtp)
//   console.log(util.compareHash(otp, verifyingOtp.otp))
//   if (verifyingOtp && bcrypt.compare(otp, verifyingOtp.otp)) {
//     console.log("Coming here in if");
//     const hash = await bcrypt.hash(newPassword, 10);
//     User.findOneAndUpdate(
//       { email: { $gte: email } },
//       { password: hash },
//       null,
//       function (err, docs) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Original Doc : ", docs);
//           res.send("Password Updated")
//         }
//       }
//     );

//   } else {
//     console.log("coming in else");
//     return res.status(200).send({ message: "incorrect otp" });
//   }
// };

// **************************************FORGET PASSWORD***************************************



module.exports.forgetPassword =(req, res) => {
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

//*****************************************CHANGE PASSWORD********************************** */

