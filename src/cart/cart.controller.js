const CartModel = require('./cart.model')


const { v4: uuidv4} = require("uuid");



//******************************8add new item in user cart*************************************
module.exports.addItemInCart =(req, res) => {
    const { userId, categoryId, productId, qty } = req.body;
    const cartItemId = uuidv4(); 
    CartModel.create({ cartItemId, userId, categoryId, productId, qty })
        .then(result => {
            res.status(201).send({ message: "Item added Success", result: "result" })
        })
        .catch(err => {
            res.status(400).send({ message: "Failed", error: err })
        })
}

//***************************remove item from the cart 3**************************************
module.exports.removeItemInCart = (req, res) => {
    const { cartItemId } = req.body;

    CartModel.findOneAndDelete({ cartItemId : cartItemId })
        .then(result => {
            res.status(200).send({ message: "Item removed Successfully" })
        })
        .catch(err => {
            res.status(400).send({ message: "Failed", error: err })
        })
}

//********************************update quantity*********************************************
module.exports.updateQuantity = (req, res) => {
    const { cartItemId, qty } = req.body;

    CartModel.findOneAndUpdate({ cartItemId : cartItemId  },{$set:{qty : qty}})
        .then(result => {
            res.status(200).send({ message: "Quantity Updated Successfully" })
        })
        .catch(err => {
            res.status(400).send({ message: "Failed", error: err })
        })
}
