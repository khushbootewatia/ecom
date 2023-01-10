const productSchema = require('./product.model')

const productCreation = async function (req, res) {
    try {
        const sellerId = req.params
        const data = req.body
        const seller = await sellerSchema.findOne(sellerId)
        const product = await productSchema.create(data)
        return res.status(200).send({status:true, result:product})
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = productCreation