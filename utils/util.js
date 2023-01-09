const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../config")


module.exports.generateOtp = () => {
    return Math.floor(Math.pow(10,3)+ Math.random() * 9000)
}

module.exports.generateHash =(data)=>{
    return  bcrypt.hashSync(String(data),10)
}

module.exports.compareHash=(data, hash) => {
    return bcrypt.compareSync(data, hash)
}

module.exports.generateToken = (userObject)=> {
    let expireTime;
    if (userObject.tokenExpirationTime)
        expireTime = userObject.tokenExpirationTime;
    else
        expireTime = 6 * 30 * config.cfg.tokenExpirationTime; //6 months
        delete userObject.tokenExpirationTime;
        return jwt.sign(userObject, config.cfg.jwtSecretKey, { expiresIn: expireTime })
        
}