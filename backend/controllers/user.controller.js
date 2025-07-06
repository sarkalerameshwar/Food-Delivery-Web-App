import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            res.status(404).json({message: "User not found. Please register first."});
            return toast.error("User not found. Please register first.");
        } 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid password"});
        const token = createToken(user._id);
        res.status(200).json({success: true, token, message: "Login successful", user});

    }catch(err){
        res.status(500).json({message: "Internal server error"});
        console.log(err);

    }
}

const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '1h' })
}

// register user
const registerUser = async(req, res)=>{
    const {name, email, password} = req.body;
    try{

        if (name ===""){
            return res.status(400).json({success:false, msg: "Please enter your name"});
        }

        if(email ===""){
            return res.status(400).json({success:false, msg: "Please enter your email"});
        }
        // check if user already exist
        const userExist = await userModel.findOne({email});
        
        if(userExist){
            res.status(400).json({success:false, msg: "User already exist"});
            toast.error("User already exist");
        } 
        // validate email format & storage password
        if(!validator.isEmail(email)) return res.status(400).json({success:false, msg: "Invalid email format"});
        if(password.length<6){
            return res.status(400).json({success:false, msg: "Password must be at least 8 characters"})
        }
        // hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create new user
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.status(200).json({success: true, message:"user registered successfully", token: token})

    }catch(err){
        console.log(err);
        res.status(400).json({success:false, message:"Error"})
    }
}   

export  {registerUser, loginUser};