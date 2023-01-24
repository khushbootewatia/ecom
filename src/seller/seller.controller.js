const bcrypt = require("bcrypt");
const util = require("../../utils/util");
const { Seller, OtpSeller } = require("../seller/seller.model");
// const otpSeller = require('../seller/seller.model')
// const sellerSchema = require('../seller/seller.model')
const sellerService = require("./seller.service");
const { sendMailer } = require("../../services/nodemailer");
const { AppError } = require("../../utils/errorHandler");
const express = require("express");
const app = express();
app.use(express.json());
const {
  signUpSchema,
  signInSchema,
  verifyOtpSchema,
  changePasswordSchema,
  forgetPasswordSchema,
  verifyChangedOtpSchema,
} = require("./seller.validation");
const { USER_ROLES } = require("../../utils/constants");

///////////////////////////////         SIGN UP        /////////////////////////////

const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const reference = "signup";
    const sellerEmail = await sellerService.getSeller({ email });
    if (sellerEmail) {
      throw new AppError(reference, "Seller already exists", 409);
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const seller = await Seller.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      password: hash,
      mobile: req.body.mobile,
      accountHolderName: req.body.accountHolderName,
      accountNumber: req.body.accountNumber,
      ifscCode: req.body.ifscCode,
      bankName: req.body.bankName,
    });
    const otp = util.generateOtp();
    const hashedOtp = util.generateHash(otp);
    await OtpSeller.create({ email: req.body.email, otp: hashedOtp });
    const payload = { to: req.body.email, subject: otp };
    await sendMailer(payload);
    res.status(200).send({ message: "Otp send successfully!" });
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /seller/signup";
    next(error);
  }
};

///////////////////////////////         Verify OTP         /////////////////////////////

const verifyOtp = async (req, res, next) => {
  try {
    const reference = "verifyOtp";
    let { email, otp } = req.body;
    const verifyingOtp = await OtpSeller.findOne({ email });
    if (!verifyingOtp || !util.compareHash(otp, verifyingOtp.otp)) {
      throw new AppError(reference, "Incorrect Otp", 400);
    }
    await Seller.findOneAndUpdate(
      { email: { $gte: email } },
      { isVerified: true }
    );
    await OtpSeller.findOneAndDelete({ email: { $gte: email } });
    res.send("User Verified");
  } catch (error) {
    error.reference = error.reference
      ? error.reference
      : "POST /seller/verifyOtp";
    next(error);
  }
};

///////////////////////////////         SIGN IN         /////////////////////////////

const signin = async (req, res, next) => {
  try {
    const reference = "signin";
    const { email, password } = req.body;
    const seller = await sellerService.getSeller({ email });
    if (!seller) {
      throw new AppError(reference, "Seller not found", 404);
    }
    if (!(await bcrypt.compare(req.body.password, seller.password))) {
      throw new AppError(reference, "Password incorrect", 401);
    }
    res.send({
      token: util.generateToken({ id:seller._id, role: USER_ROLES.SELLER}),
    });
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST /seller/signin";
    next(error);
  }
};

///////////////////////////////         Change Password        /////////////////////////////

const changePassword = async (req, res, next) => {
  try {
    const reference = "changePassword";
    const { email, currentPassword, newPassword } = req.body;
    const seller = await sellerService.getSeller({ email });
    if (!seller) {
      throw new AppError(reference, "Seller not found", 404);
    }
    if (currentPassword == newPassword) {
      throw new AppError(reference, "Current and new Password same", 400);
    }
    if (!(await bcrypt.compare(currentPassword, seller.password))) {
      throw new AppError(reference, "Current Password Incorrect", 401);
    }
    const hash = await bcrypt.hash(newPassword, 10);
    seller.updateOne({ password: hash }, function (err, result) {
      if (err) {
        console.log(err);
      }
    });
    res.json({
      status: true,
      data: "Password updated successfully",
    });
  } catch (error) {
    error.reference = error.reference
      ? error.reference
      : "POST /seller/changePassword";
    next(error);
  }
};



///////////////////////////////         Forget Password Func        /////////////////////////////



const forgetPassword = async (req, res) => {
  try{
    const reference = forgetPassword;
  let { email } = req.body;
  const seller = await sellerService.getSeller({ email });
    if (!seller) {
      throw new AppError(reference, "Seller not found", 404);
    }
  const otp = util.generateOtp();
  const hashedOtp = util.generateHash(otp);
  const findingOtpInForget = await OtpSeller.findOne({ email });
  if (findingOtpInForget) {
    findingOtpInForget.otp = hashedOtp;
  } else {
    await OtpSeller.create({ email: email, otp: hashedOtp });
  }
  const payload = { to: email, subject: otp };
  await sendMailer(payload);
  res.status(200).send({ message: "Otp send successfully!" });
}catch (error) {
  error.reference = error.reference ? error.reference : "POST /seller/forgetPassword";
  next(error);
}
};

//////////////////////////////         Verify Changed OTP        /////////////////////////////

const verifyChangedOtp = async (req, res, next) => {
  try{
    const reference = verifyChangedOtp;
  let { email, otp, newPassword } = req.body;
  const verifyingOtp = await OtpSeller.findOne({ email });
    if (!verifyingOtp || !util.compareHash(otp, verifyingOtp.otp)) {
      throw new AppError(reference, "Incorrect Otp or Bad request", 400);
    }
  const hash = await bcrypt.hash(newPassword, 10);
  await Seller.findOneAndUpdate({ email: { $gte: email } }, { password: hash });
  await OtpSeller.findOneAndDelete({ email: { $gte: email } });
  res.send("Password Updated");
}catch (error) {
  error.reference = error.reference ? error.reference : "POST /seller/verifyChangedOtp";
  next(error);
}
}



module.exports = {
  signin,
  changePassword,
  signUp,
  verifyOtp,
  forgetPassword,
  verifyChangedOtp,
};
