import express from "express"
import {verifyToken} from "../utils/verifyUser.js"
import { addNote } from "../controller/note.controller.js"

const router = express.Router()

router.post("/add", verifyToken, addNote)

export default router