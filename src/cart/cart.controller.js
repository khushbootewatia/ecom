const CartModel = require('./cart.model')
const { updateCart, removeCart } = require('./cart.services')
const { AppError } = require('../../utils/errorHandler');
const { getUser } = require('../user/user.service');



//******************************Add new item in user cart*************************************

const addItemInCart = async (req, res, next) => {

    let { userId, quantity } = req.body
    if (req.user.role === "user")
        userId = await req.user.user._id
    // const userId = data.userId
    const productId = req.params.productId
    console.log("productId----->", productId);
   

    try {
        await CartModel.create({ userId, productId, quantity })

            .then(result => {
                res.status(201).json({ message: "Item added Success", result: result })
            })
            .catch(err => {
                throw new AppError("addItemInCart", "Failed", 401)
            })
        next();

    } catch (error) {
        next(error);
    }

}

//***************************remove item from the cart 3**************************************
const removeItemInCart = async (req, res, next) => {

    let { userId, productId } = req.body
    if (req.user.role === "user")
        userId = await req.user.user._id

    try {
        await removeCart({ userId, productId })
            .then(result => {
                res.status(200).json({ message: "Item removed Successfully", result })
            })
            .catch(err => {
                throw new AppError("removeItemInCart", "Failed", 401)
            })
        next();
    } catch (error) {
        next();
    }

}

//********************************update quantity*********************************************
const updateQuantity = async (req, res, next) => {
    const {productId}=  req.params.productId
    const { quantity } = req.body;
    console.log("quantit--->",quantity);
    console.log("producID---->",productId);

    await updateCart({productId}, { $set: { quantity: quantity } })
        .then(result => {
            res.status(200).json({ message: "Quantity Updated Successfully" ,result:result})
        })
        .catch(err => {
            throw new AppError("updateQuantity", "unable to update quantity", 409)
        })
    next();

}

module.exports = { addItemInCart, removeItemInCart, updateQuantity }