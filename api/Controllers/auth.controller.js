import User from "../Models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";




//Sign Up
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

//Sign In
//first check email, if email does not exist, return error, otherwise check passord.
export const signin = async (req, res, next) =>{
    const {email, password} = req.body;

    try{
        const validUser = await User.findOne({email});
        if (!validUser) return next (errorHandler(404, "User Not found"));

        //compare saved hashed password in database with bcryptjs method compareSync
        const validPassword = bcryptjs.compareSync(password, validUser.password);     
    
        if (!validPassword) return next (errorHandler(401, 'Wrong Credentials Used!'));

        // token is equal to the unique user id
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        //remove password before sending to user in front end, seperate password and rest of information
        const {password: pass, ...rest} = validUser._doc;

        //save token in cookie || instead of returing validUser return rest so it dosent show the user password in the front end
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest); 

    
    }catch (error){
        next(error);
    }
}