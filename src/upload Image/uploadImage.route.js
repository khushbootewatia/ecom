const express = require('express')
const router = express.Router()
const {upload} = require('../../utils/awsS3')
const uploadImage = require('./uploadImage.controller')


router.post('/upload',upload.array("file"),uploadImage)

module.exports = router