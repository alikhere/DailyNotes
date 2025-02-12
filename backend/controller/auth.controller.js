import User from "../models/user.model"
import { errorHandler } from "../utils/error"
import bcryptjs from "bcryptjs"

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
        passowrd: hashedPassword
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