// const awsS3 = require('../../utils/awsS3')

const uploadImage = async function (req, res) {
    // let files = req.files
    let location = []
    for (let i = 0; i < req.files.length; i++) {
        let temp = req.files[i]
        location.push({ location: temp.location, mimetype: temp.mimetype, size: temp.size, filename: temp.originalname })
    }

    res.json({ productImage: location })
}

module.exports = uploadImage