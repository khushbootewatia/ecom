const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require('otp-generator');

const { User } = require('../user/user.model');
const  Otp = require('../otp/otp.model');


module.exports.signUp = async (req, res) => {
   console.log(req.body);
try {
  if(!req.body.number){
    return res.status(400).json({message:"Enter all fields"});
}
const user = await User.findOne({
    number: req.body.number
});
if (user) return res.status(400).send("User already registered!");
const OTP = otpGenerator.generate(6, {
    digits: true, alphabets: false, upperCase: false, specialChars: false
});
// console.log(OTP);
const number = req.body.number;
const greenwebsms = new URLSearchParams();
greenwebsms.append('token', '05fa33c4cb50c35f4a258e85ccf50509');
greenwebsms.append('to', `+${number}`);
greenwebsms.append('message', `Verification Code ${OTP}`);

await axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)

const otp = await Otp({ 
        number: number, 
        otp: OTP 
    });

//console.log(otp);
//const salt = await bcrypt.genSalt(10)
//otp.otp = await bcrypt.hash(otp.otp, salt);

await otp.save();
res.status(200).send({message:"Otp send successfully!",otp});
} catch (error) {
  console.log("error 20",error);
}
   
}


module.exports.verifyOtp = async (req, res) => {
    
    const otpHolder = await Otp.find({
        number: req.body.number
    });
    // console.log(otpHolder[0].otp);
    // console.log(req.body.otp);

    if (otpHolder[0].otp !== req.body.otp){
        console.log("hello");
    }
    
    if (otpHolder[0].otp !== req.body.otp) return res.status(400).send("Enter Correct OTP!");
    
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    // const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    // if (rightOtpFind.number === req.body.number && validUser) {
        if (rightOtpFind.number === req.body.number) {
        const user = new User(_.pick(req.body, ["number"]));
        const token = user.generateJWT();
        const result = await user.save();
        const OTPDelete = await Otp.deleteMany({
            number: rightOtpFind.number
        });
        return res.status(200).send({
            message: "User Registration Successfull!",
            token: token,
            data: result
        });
    } else {
        return res.status(400).send("Your OTP was wrong!")
    }
}

//signin
module.exports.signin = async (req, res) => {
  const signinUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!signinUser) {
    res.status(401).send({
      message: 'Invalid Email or Password',
    });
  } else {
    res.send({
      _id: signinUser._id,
      name: signinUser.name,
      email: signinUser.email,
      token: generateToken(signinUser),
    });
  }
}

// //signin 
// app.post("/login", async (req, res) => {

//     // Our login logic starts here
//     try {
//       // Get user input
//       const { email, password } = req.body;
  
//       // Validate user input
//       if (!(email && password)) {
//         res.status(400).send("All input is required");
//       }
//       // Validate if user exist in our database
//       const user = await User.findOne({ email });
  
//       if (user && (await bcrypt.compare(password, user.password))) {
//         // Create token
//         const token = jwt.sign(
//           { user_id: user._id, email },
//           process.env.TOKEN_KEY,
//           {
//             expiresIn: "2h",
//           }
//         );
  
//         // save user token
//         user.token = token;
  
//         // user
//         res.status(200).json(user);
//       }
//       res.status(400).send("Invalid Credentials");
//     } catch (err) {
//       console.log(err);
//     }
//     // Our register logic ends here
//   });

//   //create
//   app.post('/signup', (req, res) => {
//     // Get the user's email address from the form submission
//     const email = req.body.email;
  
//     // Generate the OTP
//     const otp = otplib.authenticator.generate(secret);
  
//     // Send the OTP to the user's email address
//     transporter.sendMail({
//       from: 'antino_ecom@gmail.com',
//       to: email,
//       subject: 'Signup OTP',
//       text: `Your OTP is: ${otp}`
//     });
// });
//     // Render the OTP form
    