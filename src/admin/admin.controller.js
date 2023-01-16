const User = require('../user/user.model')
const Seller = require('../seller/seller.model')
const Admin = require('./admin.model')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

//******************************ADMIN LOGIN********************************//
exports.loginAdmin =  async(req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        res.status(400)
        // throw new Error("Add email and password")
    }
    const Admin = await User.findOne({email})
    if(!user){
        res.status(400);
        throw new Error("User not found");
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if(user && passwordIsCorrect){
        const { _id, name, email} = user;
        res.status(200).json({
            _id,
            name,
            email, 
        });
    } else {
        res.status(400);
        throw new Error("Invalid email id or password");
    }
}

//******************************USER CRUD********************************//

exports.getAllUser = async(req,res)=>{
    try{
        const users = await User.find({});
        res.status(200).send({
        success : true,
        users
    });
    }catch(error){
        console.log(error);
    }
}

exports.getOneUser = async(req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        res.status(200).send({
            success: true,
            user,
        });
    }catch(error){
        console.log(error);
    }
}

exports.deleteUser = async(req,res)=>{
    const {email} = req.body;
    let user = await User.findById(email);

    if(!user){
        res.status(404).send({message:"User not found"});
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted Successfully",
    });
}

//******************************SELLER CRUD********************************//

exports.getAllSeller = async(req,res)=>{
    try{
        const seller = await Seller.find({});
        res.status(200).send({
        success : true,
        users
    });
    }catch(error){
        console.log(error);
    }
}

exports.getOneSeller = async(req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        res.status(200).send({
            success: true,
            user,
        });
    }catch(error){
        console.log(error);
    }
}   

exports.deleteSeller = async(req,res)=>{
    const {email} = req.body;
    let seller = await Seller.findById(email);

    if(!seller){
        res.status(404).send({message:"Seller not found"});
    }

    await seller.remove();

    res.status(200).json({
        success: true,
        message: "Seller deleted Successfully",
    });
}