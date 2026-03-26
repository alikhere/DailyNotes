import Note from "../models/note.model.js"
import { errorHandler } from "../utils/error.js"

export const addNote = async (req, res, next) => {
  const { title, content, tags, color } = req.body

  if (!title) return next(errorHandler(400, "Title is required"))
  if (!content) return next(errorHandler(400, "Content is required"))

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      color: color || "default",
      userId: req.user.id,
    })
    await note.save()
    res.status(201).json({ success: true, message: "Note added successfully", note })
  } catch (error) {
    next(error)
  }
}

export const editNote = async (req, res, next) => {
  const note = await Note.findById(req.params.noteId)

  if (!note) return next(errorHandler(404, "Note not found"))
  if (req.user.id != note.userId) return next(errorHandler(401, "You can only update your own note"))

  const { title, content, tags, isPinned, color } = req.body

  try {
    if (title !== undefined) note.title = title
    if (content !== undefined) note.content = content
    if (tags !== undefined) note.tags = tags
    if (isPinned !== undefined) note.isPinned = isPinned
    if (color !== undefined) note.color = color
    note.updatedAt = new Date()

    await note.save()
    res.status(200).json({ success: true, message: "Note updated successfully", note })
  } catch (error) {
    next(error)
  }
}

export const getAllNotes = async (req, res, next) => {
  const { sort = "newest", tag } = req.query

  const query = {
    userId: req.user.id,
    isArchived: false,
    isDeleted: false,
  }
  if (tag) query.tags = tag

  let sortOpt = {}
  switch (sort) {
    case "oldest":
      sortOpt = { createdAt: 1 }
      break
    case "title-asc":
      sortOpt = { title: 1 }
      break
    case "title-desc":
      sortOpt = { title: -1 }
      break
    case "updated":
      sortOpt = { updatedAt: -1 }
      break
    default:
      sortOpt = { isPinned: -1, createdAt: -1 }
  }

  try {
    const notes = await Note.find(query).sort(sortOpt)
    res.status(200).json({ success: true, message: "Notes retrieved successfully", notes })
  } catch (error) {
    next(error)
  }
}

// Soft delete — moves note to trash
export const deleteNote = async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.noteId, userId: req.user.id })
  if (!note) return next(errorHandler(404, "Note not found"))

  try {
    note.isDeleted = true
    note.deletedAt = new Date()
    note.isArchived = false
    await note.save()
    res.status(200).json({ success: true, message: "Note moved to trash" })
  } catch (error) {
    next(error)
  }
}

// Permanently delete a note from trash
export const permanentDelete = async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.noteId, userId: req.user.id })
  if (!note) return next(errorHandler(404, "Note not found"))

  try {
    await Note.deleteOne({ _id: req.params.noteId })
    res.status(200).json({ success: true, message: "Note permanently deleted" })
  } catch (error) {
    next(error)
  }
}

// Restore note from trash
export const restoreNote = async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.noteId, userId: req.user.id })
  if (!note) return next(errorHandler(404, "Note not found"))

  try {
    note.isDeleted = false
    note.deletedAt = null
    await note.save()
    res.status(200).json({ success: true, message: "Note restored", note })
  } catch (error) {
    next(error)
  }
}

// Toggle archive status
export const archiveNote = async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.noteId, userId: req.user.id })
  if (!note) return next(errorHandler(404, "Note not found"))

  try {
    note.isArchived = !note.isArchived
    if (note.isArchived) {
      note.isDeleted = false
      note.deletedAt = null
    }
    note.updatedAt = new Date()
    await note.save()
    res.status(200).json({
      success: true,
      message: note.isArchived ? "Note archived" : "Note unarchived",
      note,
    })
  } catch (error) {
    next(error)
  }
}

// Duplicate a note
export const duplicateNote = async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.noteId, userId: req.user.id })
  if (!note) return next(errorHandler(404, "Note not found"))

  try {
    const copy = new Note({
      title: `${note.title} (copy)`,
      content: note.content,
      tags: [...note.tags],
      color: note.color,
      isPinned: false,
      userId: req.user.id,
    })
    await copy.save()
    res.status(201).json({ success: true, message: "Note duplicated", note: copy })
  } catch (error) {
    next(error)
  }
}

// Get all archived notes
export const getArchivedNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isArchived: true, isDeleted: false }).sort({ updatedAt: -1 })
    res.status(200).json({ success: true, notes })
  } catch (error) {
    next(error)
  }
}

// Get all trashed notes
export const getTrashedNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isDeleted: true }).sort({ deletedAt: -1 })
    res.status(200).json({ success: true, notes })
  } catch (error) {
    next(error)
  }
}

export const updateNotePinned = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId)
    if (!note) return next(errorHandler(404, "Note not found!"))
    if (req.user.id !== note.userId) return next(errorHandler(401, "You can only update your own note!"))

    note.isPinned = req.body.isPinned
    note.updatedAt = new Date()
    await note.save()

    res.status(200).json({ success: true, message: "Note updated successfully", note })
  } catch (error) {
    next(error)
  }
}

export const searchNote = async (req, res, next) => {
  const { query } = req.query
  if (!query) return next(errorHandler(400, "Search query is required"))

  try {
    const matchingNotes = await Note.find({
      userId: req.user.id,
      isDeleted: false,
      isArchived: false,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
        { tags: { $regex: new RegExp(query, "i") } },
      ],
    }).sort({ isPinned: -1, createdAt: -1 })

    res.status(200).json({
      success: true,
      message: "Notes matching search query retrieved successfully",
      notes: matchingNotes,
    })
  } catch (error) {
    next(error)
  }
}
