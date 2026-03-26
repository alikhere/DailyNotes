import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {
  addNote,
  editNote,
  getAllNotes,
  deleteNote,
  permanentDelete,
  restoreNote,
  archiveNote,
  duplicateNote,
  getArchivedNotes,
  getTrashedNotes,
  updateNotePinned,
  searchNote,
} from "../controller/note.controller.js"

const router = express.Router()

router.post("/add", verifyToken, addNote)
router.post("/edit/:noteId", verifyToken, editNote)
router.get("/all", verifyToken, getAllNotes)
router.get("/archived", verifyToken, getArchivedNotes)
router.get("/trashed", verifyToken, getTrashedNotes)
router.get("/search", verifyToken, searchNote)

// Note actions
router.delete("/delete/:noteId", verifyToken, deleteNote)
router.delete("/permanent/:noteId", verifyToken, permanentDelete)
router.put("/restore/:noteId", verifyToken, restoreNote)
router.put("/archive/:noteId", verifyToken, archiveNote)
router.post("/duplicate/:noteId", verifyToken, duplicateNote)
router.put("/update-note-pinned/:noteId", verifyToken, updateNotePinned)

export default router
