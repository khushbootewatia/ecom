const CartModel = require('./cart.model')
const CartService = require('./cart.services')
const { AppError } = require('../../utils/errorHandler');
const { getUser } = require('../user/user.service');



//******************************Add new item in user cart*************************************
// const addItemInCart = async (req, res, next) => {
//    const userId =await getUser(req.decodedToken._id)
   
//     const {  categoryId, productId, qty } = req.body;
    
//     try {
//         CartModel.create({ userId, productId, qty })
//         .then(result => {
//             res.status(201).json({ message: "Item added Success", result: "result" })
//         })
//         .catch(err => {
//             throw new AppError(removeItemInCart,"Failed", 401)
//         })
//     } catch (error) {
        
//     }
   
// }
const addItemInCart = async (req, res, next) => {
    // const userId = await getUser(req.decodedToken._id)
    // console.log("_______",userId);
    // const {productName, qty } = req.body;
    let data = req.body
    if(req.user.role === "user")
    data.userId  = await req.user.user._id

    
    try {
        // CartModel.create({ userId,productName, qty })
        await CartModel.create({...data})
        .then(result => {
            res.status(201).json({ message: "Item added Success", result: "result" })
        })
        .catch(err => {
            throw new AppError("addItemInCart","Failed", 401)
        })
    } catch (error) {
        next(error);
    }
   
}

//***************************remove item from the cart 3**************************************
const removeItemInCart = (req, res, next) => {
    const { userId,cartItemId } = req.body;
   try {
    removeCart({ cartItemId: cartItemId })
    .then(result => {
        res.status(200).json({ message: "Item removed Successfully" })
    })
    .catch(err => {
       
    })
   } catch (error) {
    
   }
   
}

//********************************update quantity*********************************************
const updateQuantity = (req, res, next) => {
    const { cartItemId, qty } = req.body;

    updateCart({ cartItemId: cartItemId }, { $set: { quantity: qty } })
        .then(result => {
            res.status(200).json({ message: "Quantity Updated Successfully" })
        })
        .catch(err => {
            res.status(400).json({ message: "Failed", error: err })
        })
}

module.exports = { addItemInCart, removeItemInCart, updateQuantity }