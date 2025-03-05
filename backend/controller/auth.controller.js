import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
    const  {username, email, password} = req.body

    const isValidUser = await User.findOne({email}) // if above we would be take userEmail instead of email then here we have to write {email: userEmail}, but if its same then direct email will work also

    if(isValidUser) {
        return next(errorHandler(400, "User already Exist"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })
    try { 
        await newUser.save()
        res.status(201).json({
            success: true,
            message: "User Create Successfully"
        })
        
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const  {email, password} = req.body

    try {
        const validUser = await User.findOne({email})

        if(!validUser) {
            return next(errorHandler(404, "User not found"))
        }

        const validPassword = bcryptjs.compareSync(password,validUser.password)
        if(!validPassword) {
            return next(errorHandler(401, "Wrong Credentials"))
        }
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)

        const {password: pass, ...rest} = validUser._doc
        
        res.cookie("access_token", token , {httpOnly: true}).status(200).json({
            success: true,
            message: "Login Successfull!",
            rest,
        })
        
    } catch (error) {
        
    }
}