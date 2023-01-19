const awsS3 = require('../../utils/awsS3')

const uploadImage = async function (req, res) {
    // let files = req.files
    let location = []
    for (let i = 0; i < req.files.length; i++) {
        location.push(req.files[i].location)
    }
    res.json({productImage:location})
}

module.exports = uploadImage