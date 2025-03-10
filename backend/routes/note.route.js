import express from "express"
import {verifyToken} from "../utils/verifyUser.js"
import { addNote, editNote } from "../controller/note.controller.js"

const router = express.Router()

router.post("/add", verifyToken, addNote)
router.post("/edit/:noteId", verifyToken, editNote)

export default router