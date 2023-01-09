const path = require('path');

const cfg = {
    projectName: process.env.PROJECT_NAME,
    environment: process.env.NODE_ENV,
    debug: process.env.DEBUG,
    port: process.env.PORT,
    TAG: process.env.NODE_ENV,
    // uploadDir: path.resolve('./uploads'),

    sendgrid: {
        key: process.env.SENDGRID_KEY,
        fromEmail : process.env.SENDGRID_FROM_EMAIL
    },
    jwtSecretKey: "asd7abjsd7",
    tokenExpirationTime: 72 * 60 * 60 * 1000,

    homePath: process.env.HOMEPATH,
    webBasePath: process.env.WEB_BASEPATH,

    //default admin



}


module.exports = {
    cfg
   
}
