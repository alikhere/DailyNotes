import React, { useState, useEffect, useRef } from "react"
import { MdClose, MdEdit, MdPreview, MdSave } from "react-icons/md"
import TagInput from "../../components/Input/TagInput"
import axios from "axios"
import { toast } from "react-toastify"
import { NOTE_COLORS, renderMarkdown } from "../../utils/helper"

const API_URL = import.meta.env.VITE_API_URL

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "")
  const [content, setContent] = useState(noteData?.content || "")
  const [tags, setTags] = useState(noteData?.tags || [])
  const [color, setColor] = useState(noteData?.color || "default")
  const [error, setError] = useState(null)
  const [tab, setTab] = useState("write") // 'write' | 'preview'
  const [saving, setSaving] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // Ctrl+S to save
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleAddNote()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  const editNote = async () => {
    const noteId = noteData._id
    setSaving(true)
    try {
      const res = await axios.post(
        `${API_URL}/api/note/edit/${noteId}`,
        { title, content, tags, color },
        { withCredentials: true }
      )
      if (res.data.success === false) {
        setError(res.data.message)
        toast.error(res.data.message)
        return
      }
      toast.success("Note updated")
      getAllNotes()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update note")
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const addNewNote = async () => {
    setSaving(true)
    try {
      const res = await axios.post(
        `${API_URL}/api/note/add`,
        { title, content, tags, color },
        { withCredentials: true }
      )
      if (res.data.success === false) {
        setError(res.data.message)
        toast.error(res.data.message)
        return
      }
      toast.success("Note created")
      getAllNotes()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note")
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = () => {
    if (!title.trim()) {
      setError("Please enter a title")
      return
    }
    if (!content.trim()) {
      setError("Please enter some content")
      return
    }
    setError("")
    type === "edit" ? editNote() : addNewNote()
  }

  const markdownHtml = renderMarkdown(content)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#2d3154] shrink-0">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {type === "edit" ? "Edit Note" : "New Note"}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:block">Ctrl+S to save</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#222639] transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>
      </div>

      {/* Color picker */}
      <div className="flex items-center gap-2 py-3 shrink-0">
        <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">Color:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(NOTE_COLORS).map(([key, val]) => (
            <button
              key={key}
              title={val.label}
              onClick={() => setColor(key)}
              className={`w-5 h-5 rounded-full ${val.dot} transition-all duration-150 ${
                color === key
                  ? "ring-2 ring-offset-2 ring-primary dark:ring-offset-[#1a1d2e] scale-110"
                  : "hover:scale-110 opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Title input */}
      <div className="pb-3 shrink-0">
        <input
          ref={titleRef}
          type="text"
          className="w-full text-xl font-semibold bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-700 border-0"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Write / Preview tabs */}
      <div className="flex items-center gap-1 mb-2 shrink-0">
        <button
          onClick={() => setTab("write")}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
            tab === "write"
              ? "bg-primary/10 dark:bg-primary/15 text-primary"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222639]"
          }`}
        >
          <MdEdit className="text-sm" />
          Write
        </button>
        <button
          onClick={() => setTab("preview")}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
            tab === "preview"
              ? "bg-primary/10 dark:bg-primary/15 text-primary"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222639]"
          }`}
        >
          <MdPreview className="text-sm" />
          Preview
        </button>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-600">Markdown supported</span>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden min-h-0">
        {tab === "write" ? (
          <textarea
            className="w-full h-full text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#222639] placeholder-slate-400 dark:placeholder-slate-600 border border-slate-200 dark:border-[#2d3154] rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none font-mono leading-relaxed transition-all"
            placeholder="Start writing... (Markdown is supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-[#222639] border border-slate-200 dark:border-[#2d3154] rounded-xl p-4">
            {content ? (
              <div
                className="markdown-body text-sm"
                dangerouslySetInnerHTML={{ __html: markdownHtml }}
              />
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-600 italic">
                Nothing to preview yet — switch to Write and add some content.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="pt-3 shrink-0">
        <label className="input-label block mb-1.5">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs pt-2 shrink-0">{error}</p>
      )}

      {/* Footer */}
      <div className="pt-4 shrink-0">
        <button
          className="btn-primary flex items-center justify-center gap-2"
          onClick={handleAddNote}
          disabled={saving}
        >
          <MdSave className="text-base" />
          {saving ? "Saving…" : type === "edit" ? "Update Note" : "Create Note"}
        </button>
      </div>
    </div>
  )
}

export default AddEditNotes
