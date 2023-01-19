const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config({path: ".env"})
const {convertFileSize} = require('../utils/util')

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'us-west-2'
    
})



exports.upload = multer({
    storage: multerS3({
        s3,
        ACLs: "public-read",
        bucket: "blogapi",
        metadata: function (req, file, callback) {
            callback(null, { fieldName: file.fieldname })
            // console.log(file.fieldname)
        },
        key: function (req, file, callback) {
            callback(null, `productImage/${file.originalname}`)
        }
    }),
    // fileFilter,
    limits: { fileSize: convertFileSize("5MB"), files: 100 },
})