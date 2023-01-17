const config = require("../config");
// const Promise   = require('bluebird');
var nodemailer = require("nodemailer");

const sendMailer = async(e) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yatinnarula99913@gmail.com",
      pass: "edoorxikgfphclat",
    },
  });
  var message = e.subject
  var mailOptions = {
    from: "yatinnarula99913@gmail.com",
    to: e.to,
    subject: "Sending Email using Node.js",
    text: `Your otp is ${message}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " );
    }
  });
};

// ========================== Export Module Start ==========================
module.exports = {
  sendMailer
};
