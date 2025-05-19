import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import errorHandler from '../utils/error.js';
import jwt from 'jsonwebtoken'
export const  signup=async (req,res)=>{
    const {username,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({username:username,password:hashedPassword});
    try{
        await newUser.save()
        res.status(201).json({message:"User created successfully"});
    }catch (error){
        res.status(500).json(error.message)

    }
    

};

export const signin=async(req,res,next)=>{
    const {username,password}=req.body;
    try{
        const validUser=await User.findOne({username});
        if(!validUser) return next(errorHandler(404,'User not found'))
        const validPassword=bcryptjs.compareSync(password,validUser.password);
       if(!validPassword) return next(errorHandler(401,'wrong credentials'));
       const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const {password:hashedPassword, ...rest}=validUser._doc;
        
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
    }catch(error){
        next(error)
    }
}


