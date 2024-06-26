const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwtConfig = require("../../config/jwtConfig");
// const mongoose = require("mongoose");


const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        let user = await userModel.findOne({email});
        if(user) {
            return res.status(400).json({message: "User with the given email alreay exist"});
        } else if (!name || !email || !password) {
            return res.status(400).json({message: "All field are required"});
        } else if (!validator.isEmail(email)) {
            return res.status(400).json({message: "Email must be a valid email"});
        } else if (!validator.isStrongPassword(password)) {
            return res.status(400).json({message: "Password must be strong password"})
        } else {
            user = new userModel({name, email, password});
            const salt = await bcrypt.genSalt(13);
            user.password = await bcrypt.hash(user.password, salt)
            await user.save();
            const token = jwtConfig.createToken(email, password);
            res.status(201).json({message: "Register succesfull", user: user, token: token});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        let user = await userModel.findOne({email});
        if(user) {
            const matchPassword = await bcrypt.compare(password, user.password);
            if(matchPassword) {
                const token = jwtConfig.createToken(email, password);
                res.status(200).json({message: "Login succesfull", user: user, token: token});
            } else {
                return res.status(400).json({message: "Invalid email or password"});
            }
        } 
        return res.status(400).json({message: "Invalid email or password"});
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

const findUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        let user = await userModel.findById(userId);
        if(user) {
            res.status(200).json({message: "Get user succesfull"  , user});
        } else {
            res.status(404).json({message: "User not found"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

const getAllUser = async (req, res) => {
    try {
        const user = await userModel.find();

        res.status(200).json({message: "Get all user succesfull"  ,user});
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

module.exports = {registerUser, loginUser, findUser, getAllUser};