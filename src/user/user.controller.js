const bcrypt = require("bcrypt");

const util = require("../../utils/util")

const { User, TransientUser } = require('../user/user.model');


console.log(User, " ------", TransientUser, "line 8")
const sendGrid = require("../../services/sendgrid_email")

//******************************SIGNUP********************************//

module.exports.signUp = async (req, res) => {
  let { name, email, password } = req.body
  console.log(req.body);

  try {

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
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
    sendGrid.sendEmail(payload)
    res.status(200).send({ message: "Otp send successfully!", otp });
  } catch (error) {
    throw error
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
      return res.status(400).send({ "message": "something went wrong please try again" })

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
    res.status(401).send({
      message: 'Invalid Email or Password',
    });
  } else {
    res.send({
      token: util.generateToken({ email }),
    });
  }
}


