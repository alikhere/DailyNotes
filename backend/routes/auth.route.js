import express from "express"
import { signin, signup, signout } from "../controller/auth.controller.js"
import {verifyToken} from "../utils/verifyUser.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/signin",signin)
router.get("/signout", verifyToken, signout)

export default router