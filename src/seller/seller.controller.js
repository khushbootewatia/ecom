const bcrypt = require("bcrypt");

const util = require("../../utils/util");

const { Seller, otpSeller } = require("../seller/seller.model");

console.log(Seller, " ------", otpSeller,"line 8"); 

const signin = async (req, res) => {
  try {
    const values = await Seller.findOne({ email: req.body.email });
    if (!values) {
      return res.status(404).send("User not found");
    } else {
      if (await bcrypt.compare(req.body.password, values.password)) {
        res.send("Logged in successfully");
      } else {
        res.write("Password incorrect");
        res.send();
      }
    }
  } catch (error) {
    console.log(error);
    res.send();
  }
};

const changePassword = async (req, res) => {
  try {
    const values = await Seller.findOne({ email: req.body.email });
    if (!values) {
      return res.status(404).send("User not found");
    } else {
      if (await bcrypt.compare(req.body.currentPassword, values.password)) {
        const hash = await bcrypt.hash(req.body.newPassword, 10);
        values.password = hash;
      } else {
        res.write("Password incorrect");
        res.send();
      }
    }
  } catch (error) {
    console.log(error);
    res.send();
  }
};

const signUp = async (req, res) => {
  ////
  try {
    const sellerEmail = await Seller.findOne({ email: req.body.email });
    res.send("User already exists with this email");
  } catch {
    const hash = await bcrypt.hash(req.body.password, 10);
    const seller = await Seller.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      password: hash,
      mobile: req.body.mobile,
      account: {
        accountHolderName: req.body.account.accountHolderName,
        accountNumber: req.body.account.accountNumber,
        ifscCode: req.body.account.ifscCode,
        bankName: req.body.account.bankName,
      },
    });

    const otp = util.generateOtp();

    // console.log(OTP);
    console.log(otp);

    const hashedOtp = util.generateHash(otp);

    await otpSeller.create({ email: email, otp: hashedOtp });
    const payload = { to: email, subject: "verification Email" };
    sendGrid.sendEmail(payload);
    res.status(200).send({ message: "Otp send successfully!", otp });
  }
};


const verifyOtp = (req, res) => {
    let { email, otp } = req.body;
    // console.log("email", email);
    otpSeller.findOne({ email })
      .then(otpSeller => {
        if (!otpSeller || !util.compareHash(otp, otpSeller.otp)) return res.status(200).send({ "message": "incorrect otp" })
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
  

module.exports = {
  signin,
  changePassword,
  signUp,
  verifyOtp
};
