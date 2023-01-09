const config    = require('../config');
// const Promise   = require('bluebird');
var     ejs     = require('ejs');
const sgMail    = require('@sendgrid/mail');
var fs          = require('fs')

sgMail.setApiKey(config.cfg.sendgrid.key);


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

function sendEmail(payload) {
    // return _templateRead(payload.template,payload)
    //     .then(function (htmlContent) {
            const msg = {
                to: payload.to,
                from: config.cfg.sendgrid.fromEmail,
                subject: payload.subject,
                html: 'htmlContent',
            };
            return sgMail.send(msg, function (error, info) {
               console.log("error",error);
               console.log("info",info)
                if (error) {
                    return { status: false, error };
                } else {
                    return { status: true, info }
                }
            });
        // })
}


// ========================== Export Module Start ==========================
module.exports = {
    sendEmail,
    
}

