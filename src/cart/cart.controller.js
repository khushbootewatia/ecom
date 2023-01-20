const CartModel = require('./cart.model')
const CartService = require('./cart.services')


const { v4: uuidv4 } = require("uuid");
const { AppError } = require('../../utils/errorHandler');



//******************************Add new item in user cart*************************************
const addItemInCart = (req, res, next) => {
   
   
    const { userId, categoryId, productId, qty } = req.body;
    const cartItemId = uuidv4();
    try {
        CartModel.create({ cartItemId, userId, categoryId, productId, qty })
        .then(result => {
            res.status(201).send({ message: "Item added Success", result: "result" })
        })
        .catch(err => {
            throw new AppError(removeItemInCart,"Failed", 401)
        })
    } catch (error) {
        
    }
   
}

//***************************remove item from the cart 3**************************************
const removeItemInCart = (req, res, next) => {
    const { userId,cartItemId } = req.body;
   try {
    CartModel.findOneAndDelete({ cartItemId: cartItemId })
    .then(result => {
        res.status(200).send({ message: "Item removed Successfully" })
    })
    .catch(err => {
       
    })
   } catch (error) {
    
   }
   
}

//********************************update quantity*********************************************
const updateQuantity = (req, res, next) => {
    const { cartItemId, qty } = req.body;

    CartModel.findOneAndUpdate({ cartItemId: cartItemId }, { $set: { quantity: qty } })
        .then(result => {
            res.status(200).send({ message: "Quantity Updated Successfully" })
        })
        .catch(err => {
            res.status(400).send({ message: "Failed", error: err })
        })
}

module.exports = { addItemInCart, removeItemInCart, updateQuantity }