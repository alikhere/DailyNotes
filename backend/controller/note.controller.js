import Note from "../models/note.model.js"
import { errorHandler } from "../utils/error.js"

export const addNote =  async(req, res, next) => {
    const {title, content, tags} = req.body

    if(!title) {
        return next(errorHandler(400, "Title is required"))
    }

    if(!content) {
        return next(errorHandler(400, "Content is required"))
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: req.user.id
        })
        await note.save()
        res.status(201).json({
            success: true,
            message: "Note added successfully",
            note
        })
        
    } catch (error) {
        next(error)
    }
}