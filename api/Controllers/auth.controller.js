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
};


//if user exist sign in user, otherwise create user
export const google = async (req, res, next) =>{
    try{
        const user = await User.findOne({email: req.body.email}) // from User Model
        if (user) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            const {password: pass, ...rest} = user._doc; //seperate password and rest
            res 
            .cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest); //user data
        } else{
            //then generate a random password because it is required in app, but google auth does not provide password.
            //16 character password
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); 
            //Hash password before storing
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10); 
            //Save the new user, with some numbers and letters at the end
            const newUser = new User({
                username:req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
              });
              await newUser.save(); //save
              
              //create token using jwt
                const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET); //unique id
                const { password: pass, ...rest } = newUser._doc;
                res
                    .cookie('access_token', token, { httpOnly: true })
                    .status(200)
                    .json(rest);
    
        }
        
    }catch (error){
        next(error)
    }


};