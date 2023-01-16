

const bcrypt = require("bcrypt");
const AppError = require("../errorHandler/appError")

const util = require("../../utils/util")

const { User, TransientUser, forgetUser } = require('../user/user.model');


const sendGrid = require("../../services/sendgrid_email")


//******************************SIGNUP********************************//

module.exports.signUp = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    // console.log(req.body);

// module.exports.signUp = async (req, res,next) => {
//   try {
//   let { name, email, password } = req.body
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
    // next (error)
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
      // throw new AppError("something went wrong please try again", 400)
      //   throw new AppError("something went wrong please try again", 400)

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
      token: util.generateToken({ email}),
    });
  }
}


module.exports.changePassword = async (req, res) => {
  const { email, password, newPassword } = req.body;
  const user = await User.findOne({
    email
  });
  // if(!user)


}

module.exports.forgetPasswordFunc = async (req, res) => {
  let { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const otp = util.generateOtp();
  const hashedOtp = util.generateHash(otp);
  const findingOtpInForget = await transientUser.findOne({ email });
  if (findingOtpInForget) {
    findingOtpInForget.otp = hashedOtp;
  } else {
    await TransientUser.create({ email: email, otp: hashedOtp });
  }
  const payload = { to: email, subject: otp };
  await sendMailer(payload);
  res.status(200).send({ message: "Otp send successfully!" });
};

module.exports.verifyChangedOtp = async (req, res) => {
  let { email, otp, newPassword } = req.body;
  const verifyingOtp = await TransientUser.findOne({ email });
  if (!verifyingOtp || !bcrypt.compare(otp, verifyingOtp.otp)) {
    res.send("Bad Request",400)
    throw new AppError("Password incorrect", 401);    
  } else {
    const hash = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email: { $gte: email } },
      { password: hash }
    );
    await TransientUser.findOneAndDelete({ email: { $gte: email } });
    res.send("Password Updated");
  }
};
// // **************************************FORGET PASSWORD***************************************




// // *************************************RESET PASSWORD************************************


