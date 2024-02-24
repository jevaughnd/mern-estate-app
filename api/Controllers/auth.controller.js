import User from "../Models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) =>{

    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10); //hash password
    const newUser = new User({username, email, password:hashedPassword});

    try{
        await newUser.save()
        res.status(201).json("User Was Created Succesfully!");

    }catch(error){
        next(error);
    }
};

