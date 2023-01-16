const bcrypt = require("bcrypt");
const util = require("../../utils/util");
const { Seller, OtpSeller } = require("../seller/seller.model");
const { sendMailer } = require("../../services/nodemailer");
const AppError = require("../errorHandler/appError");
const {
  signUpSchema,
  signInSchema,
  verifyOtpSchema,
  changePasswordSchema,
  forgetPasswordSchema,
  verifyChangedOtpSchema,
} = require("./seller.validation");

///////////////////////////////         SIGN UP        /////////////////////////////

const signUp = async (req, res, next) => {
  const { error, value } = signUpSchema.validate(req.body);
  if (error) {
    const message = error.details[0].message;
    res.send({ message });
    return;
  }
  const sellerEmail = await Seller.findOne({ email: req.body.email });
  if (sellerEmail) {
    res.send("Seller exists");
    return;
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
};

///////////////////////////////         Verify OTP         /////////////////////////////

const verifyOtp = async (req, res) => {
  const { error, value } = verifyOtpSchema.validate(req.body);
  if (error) {
    const message = error.details[0].message;
    res.send({ message });
    return;
  }
  let { email, otp } = req.body;
  const verifyingOtp = await OtpSeller.findOne({ email });
  if (!verifyingOtp || !util.compareHash(otp, verifyingOtp.otp)) {
    res.send("Incoorect otp");
    return;
    throw new AppError("OTP incorrect", 401);
  }
  await Seller.findOneAndUpdate(
    { email: { $gte: email } },
    { isVerified: true }
  );
  await OtpSeller.findOneAndDelete({ email: { $gte: email } });
  res.send("User Verified");
};

///////////////////////////////         SIGN IN         /////////////////////////////

const signin = async (req, res) => {
  const { error, value } = signInSchema.validate(req.body);
  if (error) {
    const message = error.details[0].message;
    res.send({ message });
    return;
  }
  const { email, password } = req.body;
  const seller = await Seller.findOne({ email });
  if (!seller) {
    res.send("Seller Not found");
    return;
    // throw new AppError("seller not found", 404);
  }
  if (!(await bcrypt.compare(req.body.password, seller.password))) {
    res.send("Incorrect Password");
    return;
    // throw new AppError("Password incorrect", 401);
  }
  res.send({
    token: util.generateToken({ email }),
  });
};

///////////////////////////////         Change Password        /////////////////////////////

const changePassword = async (req, res) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    const message = error.details[0].message;
    res.send({ message });
    return;
  }
  const { email, currentPassword, newPassword } = req.body;
  const seller = await Seller.findOne({ email });
  if (!seller) {
    res.send("Seller not found");
    return;
  }
  if (!(await bcrypt.compare(currentPassword, seller.password))) {
    res.send("Incorrect Current Password");
    return;
    // throw new AppError("Password incorrect", 401);
  }
  const hash = await bcrypt.hash(newPassword, 10);
  seller.password = hash;
  res.send("Password Updated Successfully");
};

///////////////////////////////         Forget Password Func        /////////////////////////////

const forgetPasswordFunc = async (req, res) => {
  const { error, value } = forgetPasswordSchema.validate(req.body);
  if (error) {
    const message = error.details[0].message;
    res.send({ message });
    return;
  }
  let { email } = req.body;
  const seller = await Seller.findOne({ email });
  if (!seller) {
    res.send("Seller not found");
    return;
    // throw new AppError("Seller not found", 404);
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
};

//////////////////////////////         Verify Changed OTP        /////////////////////////////

const verifyChangedOtp = async (req, res) => {
  const { error, value } = verifyChangedOtpSchema.validate(req.body);
  if (error) {
    const message = error.details[0].message;
    res.send({ message });
    return;
  }
  let { email, otp, newPassword } = req.body;
  const verifyingOtp = await OtpSeller.findOne({ email });
  if (!verifyingOtp || !(await bcrypt.compare(otp, verifyingOtp.otp))) {
    res.send("Wrong email or bad request");
    return;
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await Seller.findOneAndUpdate({ email: { $gte: email } }, { password: hash });
  await OtpSeller.findOneAndDelete({ email: { $gte: email } });
  res.send("Password Updated");
};

module.exports = {
  signin,
  changePassword,
  signUp,
  verifyOtp,
  forgetPasswordFunc,
  verifyChangedOtp,
};

