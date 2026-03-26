import React, { useState } from "react"
import { MdAdd, MdClose } from "react-icons/md"

function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("")

  const addNewTag = () => {
    const trimmed = inputValue.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setInputValue("")
    } else {
      setInputValue("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addNewTag()
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      {tags?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs font-medium bg-primary/10 dark:bg-primary/15 text-primary dark:text-primary-hover px-2 py-1 rounded-full"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:opacity-70 transition-opacity"
              >
                <MdClose className="text-xs" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 text-sm bg-slate-100 dark:bg-[#222639] border border-slate-200 dark:border-[#2d3154] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 px-3 py-1.5 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={addNewTag}
          className="p-1.5 rounded-lg border border-primary/40 hover:bg-primary/10 dark:hover:bg-primary/15 text-primary transition-colors"
        >
          <MdAdd className="text-lg" />
        </button>
      </div>
    </div>
  )
}

export default TagInput
