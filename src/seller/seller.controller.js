const bcrypt = require("bcrypt");

const util = require("../../utils/util");

const { Seller, otpSeller } = require("../seller/seller.model");

console.log(Seller, " ------", otpSeller, "line 8");

const { sendMailer } = require("../../services/nodemailer");

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
    if (sellerEmail) {
      res.send("User already exists with this email");
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      console.log(req.body);
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
      console.log("Created seller");
      const otp = util.generateOtp();

      // console.log(OTP);
      console.log(otp);

      const hashedOtp = util.generateHash(otp);
      console.log(hashedOtp);
      await otpSeller.create({ email: req.body.email, otp: hashedOtp });
      const payload = { to: req.body.email, subject: otp };
      console.log("''");
      console.log(sendMailer);
      const mailing = async (req, res) => {
        await sendMailer(payload);
      };
      mailing();
      console.log(";;");
      res.status(200).send({ message: "Otp send successfully!", otp });
    }
  } catch {}
};

const verifyOtp = async (req, res) => {
  let { email, otp } = req.body;
  console.log(req.body);
  const verifyingOtp = await otpSeller.findOne({ email });
  if (!verifyingOtp || !util.compareHash(otp, verifyingOtp.otp)) {
    console.log("coming in if");
    return res.status(200).send({ message: "incorrect otp" });
  } else {
    console.log("Coming here in else");
    Seller.findOneAndUpdate({email: {$gte:email} }, 
      {isVerified:true}, null, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Original Doc : ",docs);
      }
    })
    // return Seller.findOneAndUpdate(
    //   { email },
    //   { $set: { isVerified: true } },
    //   { new: true }
    // );
  }
  //   .then(seller => {
  //     console.log(seller, "user");
  //     if (seller && seller.isVerified)
  //       return res.status(200).send({ "message": "otp verified successfully" })
  //     return res.status(400).send({ "message": "something went wrong please try again" })

  //   })
  //   .catch(err => {
  //     throw err
  //   })
};

module.exports = {
  signin,
  changePassword,
  signUp,
  verifyOtp,
};
