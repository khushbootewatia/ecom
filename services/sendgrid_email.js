const config    = require('../config');
const {resetToken}= require('../src/user/user.controller')
// var     ejs     = require('ejs');
const sgMail    = require('@sendgrid/mail');
var fs          = require('fs')




// function _templateRead(template, params) {
//     let filename = "lib/emailTemplate/"+template;
//     return new Promise(function (resolve, reject) {
//         ejs.renderFile(filename, params, function (error, htmlData) {
//             if (error) {
//                 reject(error);
//             }
//             resolve(htmlData);
//         });
//     });
// }


   

const sendEmail=(payload) =>{
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.cfg.sendgrid.key);

sgMail.setApiKey(process.env.SENDGRID_KEY);

const msg = {
  to: payload.to,
  from: 'sunil.r@antino.io',
  subject: 'OTP verification',
  text: 'please verify this otp',
  html: `<p><h2>please use this otp to verify you account</h2>
 <h1> ${payload.otp} </h1></p>`
};

sgMail.send(msg).catch((error)=>{
console.log(JSON.stringify(error))
})
// function _templateRead(template, params) {
//     let filename = "lib/emailTemplate/"+template;
//     return new Promise(function (resolve, reject) {
//         ejs.renderFile(filename, params, function (error, htmlData) {
//             if (error) {
//                 reject(error);
//             }
//             resolve(htmlData);
//         });
//     });
// }
    function _templateRead(template, params) {
    let filename = "lib/emailTemplate/"+template;
    return new Promise(function (resolve, reject) {
        ejs.renderFile(filename, params, function (error, htmlData) {
            if (error) {
                reject(error);
            }
            resolve(htmlData);
        });
    });
}

}



const sendEmailForResetPassword=(payload) =>{
  const sgMail = require('@sendgrid/mail');
  
  sgMail.setApiKey(config.cfg.sendgrid.key);
  
  sgMail.setApiKey(process.env.SENDGRID_KEY);
  
  const msg = {
    to: payload.to,
    from: 'wdnarendrakumar@gmail.com',
    subject: 'OTP verification',
    html: ` <p>You are receiving this email because you (or someone else) have requested to reset the password for your account.</p>
    <p>Please click on the following link to complete the process:</p>
    <a href="http://localhost:5001/api/user/resetPassword/${payload.resetToken}"><h3>Reset password</h3></a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
  };
  
  sgMail.send(msg).catch((error)=>{
  console.log(JSON.stringify(error))
  })
  
  }



// function sendEmail(payload) {
//     // return _templateRead(payload.template,payload)
//     //     .then(function (htmlContent) {
//             const msg = {
//                 to: payload.to,
//                 from: config.cfg.sendgrid.fromEmail,
//                 subject: payload.subject,
//                 html: 'htmlContent',
//             };
//             return sgMail.send(msg, function (error, info) {
//                console.log("error",error);
//                console.log("info",info)
//                 if (error) {
//                     return { status: false, error };
//                 } else {
//                     return { status: true, info }
//                 }
//             });
//         // })
// }


// ========================== Export Module Start ==========================
module.exports = {
    sendEmail,sendEmailForResetPassword
    
}
