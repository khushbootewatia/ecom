const CartModel = require('./cart.model')
const { updateCart, removeCart,find} = require('./cart.services')
const { AppError } = require('../../utils/errorHandler');



//******************************Add new item in user cart*************************************

const addItemInCart = async (req, res, next) => {

    let { userId, quantity } = req.body
        userId = await req.user.user._id
    // const userId = data.userId
    const productId = req.params.productId
    console.log("productId----->", productId);
   
   
    try {
        const productFound = await CartModel.findOne({productId})
        console.log(productFound,"<-----");
    if (productFound) throw new AppError("addItemInCart", "Item Is already Added, you can change Quantity", 409)
    
    
        await CartModel.create({ userId, productId, quantity })

            .then(result => {
                res.status(201).json({ message: "Item added Success", result: result })
            })
            .catch(err => {
                throw new AppError("addItemInCart", "Failed", 401)
            })
     

    } catch (error) {
        next(error);
    }

}

//***************************remove item from the cart 3**************************************
const removeItemInCart = async (req, res, next) => {

    let { userId, productId } = req.body
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
    const userId = await req.user.user._id
    const productId = req.params.productId
    const { quantity } = req.body;


    await updateCart({userId, productId }, { $set: { quantity: quantity } })
        .then(result => {
            res.status(200).json({ message: "Quantity Updated Successfully", result: result })
        })
        .catch(err => {
            throw new AppError("updateQuantity", "unable to update quantity", 409)
        })
    next();

}

//*******************************Get Items in Cart****************************************** */

const getItems = async (req, res,next) => {
    const userId = await req.user.user._id
    // const { userId } = req.query;
    console.log("userId--->",userId);
    try {
        if (!userId) {
            throw new AppError("getItems", "Invalid USER", 409)
            
        }
        await find( {userId :userId})
        
        .then(result => {
            res.status(200).json({ message: "Success", result: result })
        }).catch(err => {
           
            throw new AppError("getCategory", " Something Went Wrong ", 409)
            
        })
          } 
     catch (error) {
        next(error);
    }
    
  };
  


module.exports = { addItemInCart, removeItemInCart, updateQuantity, getItems }