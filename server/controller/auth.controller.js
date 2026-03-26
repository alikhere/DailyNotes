import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"))
  }

  try {
    const isValidUser = await User.findOne({ email })
    if (isValidUser) return next(errorHandler(400, "User already exists"))

    // Use async hash to avoid blocking the event loop
    const hashedPassword = await bcryptjs.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword })

    await newUser.save()
    res.status(201).json({ success: true, message: "User created successfully" })
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(errorHandler(400, "Email and password are required"))
  }

  try {
    const validUser = await User.findOne({ email })
    if (!validUser) return next(errorHandler(404, "User not found"))

    // Use async compare to avoid blocking the event loop
    const validPassword = await bcryptjs.compare(password, validUser.password)
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"))

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    const { password: pass, ...rest } = validUser._doc

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      })
      .status(200)
      .json({ success: true, message: "Login Successful", user: rest })
  } catch (error) {
    next(error)
  }
}

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      })
      .status(200)
      .json({ success: true, message: "User logged out successfully" })
  } catch (error) {
    next(error)
  }
}
