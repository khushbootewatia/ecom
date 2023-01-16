const bcrypt = require("bcryptjs");

const util = require("../../utils/util");

const { Seller, otpSeller, forgetSeller } = require("../seller/seller.model");


const { sendMailer } = require("../../services/nodemailer");

const signin = async (req, res) => {
  try {
    const values = await Seller.findOne({ email: req.body.email });
    if (!values) {
      return res.status(404).send("User not found");
    } else {
      if (await bcrypt.compare(req.body.password, values.password)) {
        const email1 = req.body.email
        res.send({
          token: util.generateToken({ email1}),
        });
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

      const hashedOtp = util.generateHash(otp);
      await otpSeller.create({ email: req.body.email, otp: hashedOtp });
      const payload = { to: req.body.email, subject: otp };
      const mailing = async (req, res) => {
        await sendMailer(payload);
      };
      mailing();
      res.status(200).send({ message: "Otp send successfully!", otp });
    }
  } catch {}
};

const verifyOtp = async (req, res) => {
  let { email, otp } = req.body;
  const verifyingOtp = await otpSeller.findOne({ email });
  if (!verifyingOtp || !util.compareHash(otp, verifyingOtp.otp)) {
    return res.status(200).send({ message: "incorrect otp" });
  } else {
    Seller.findOneAndUpdate({email: {$gte:email} }, 
      {isVerified:true}, null, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Original Doc : ",docs);
      }
    })
  }
};

const forgetPasswordFunc = async (req, res) => {
  let { email } = req.body;
  try {
    const value = await Seller.findOne({email});
    const otp = util.generateOtp();
    const hashedOtp = util.generateHash(otp);
    try {
        const findingOtpInForget = await forgetSeller.findOne({email})
        console.log(findingOtpInForget)
        if (findingOtpInForget){
            findingOtpInForget.otp = hashedOtp
        }else{
            await forgetSeller.create({ email: req.body.email, otp: hashedOtp });
        }
      
    } catch (err) {
      console.log(err);
    }

    const payload = { to: email, subject: otp };
    const mailing = async (req, res) => {
      await sendMailer(payload);
    };

    mailing();
    res.status(200).send({ message: "Otp send successfully!", otp });
  } catch (err) {
    res.send("Email not registered");
  }
};

const verifyChangedOtp = async (req, res) => {
  let { email, otp, newPassword } = req.body;
  const verifyingOtp = await forgetSeller.findOne({ email });
  console.log(util.compareHash(otp, verifyingOtp.otp))
  if (verifyingOtp && bcrypt.compare(otp, verifyingOtp.otp)) {
    const hash = await bcrypt.hash(newPassword, 10);
    Seller.findOneAndUpdate(
      { email: { $gte: email } },
      { password: hash },
      null,
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.send("Password Updated")
        }
      }
    );
    
  } else {
    console.log("coming in else");
    return res.status(200).send({ message: "incorrect otp" });
  }
};


module.exports = {
  signin,
  changePassword,
  signUp,
  verifyOtp,
  forgetPasswordFunc,
  verifyChangedOtp
};
