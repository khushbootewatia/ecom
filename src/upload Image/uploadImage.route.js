const express = require('express')
const router = express.Router()
const { upload } = require('../../utils/awsS3')
const { AppError } = require('../../utils/errorHandler')
const uploadImage = require('./uploadImage.controller')


router.post('/upload', upload.array("file"), uploadImage, (error, req, res, next) => {
    if (error) {
        next(new AppError('LIMIT_FILE_SIZE','LIMIT_FILE_SIZE'))
    }
})

module.exports = router