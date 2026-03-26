import React, { useState } from "react"
import {
  MdNotes,
  MdPushPin,
  MdArchive,
  MdDelete,
  MdAdd,
  MdChevronRight,
  MdLabel,
} from "react-icons/md"

const navItems = [
  { id: "all", label: "All Notes", icon: MdNotes },
  { id: "pinned", label: "Pinned", icon: MdPushPin },
  { id: "archived", label: "Archive", icon: MdArchive },
  { id: "trash", label: "Trash", icon: MdDelete },
]

const Sidebar = ({ activeView, onViewChange, allTags, onNewNote, noteCount }) => {
  const [tagsExpanded, setTagsExpanded] = useState(true)

  const activeTag = activeView.startsWith("tag:") ? activeView.slice(4) : null

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col bg-slate-50 dark:bg-[#13151f] border-r border-slate-200 dark:border-[#2d3154] overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200 dark:border-[#2d3154]">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-slate-400 dark:text-slate-500">Daily</span>
          <span className="text-primary">Notes</span>
        </h1>
      </div>

      {/* New Note Button */}
      <div className="px-3 py-4">
        <button
          onClick={onNewNote}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          <MdAdd className="text-lg" />
          New Note
          <span className="ml-auto text-xs opacity-60 font-mono">⌘N</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`sidebar-item w-full ${activeView === id ? "sidebar-item-active" : ""}`}
          >
            <Icon className="text-lg shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {id === "all" && noteCount > 0 && (
              <span className="text-xs text-slate-400 dark:text-slate-600 font-mono">
                {noteCount}
              </span>
            )}
          </button>
        ))}

        {/* Tags section */}
        {allTags.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setTagsExpanded((p) => !p)}
              className="sidebar-item w-full"
            >
              <MdLabel className="text-lg shrink-0" />
              <span className="flex-1 text-left">Tags</span>
              <MdChevronRight
                className={`text-base text-slate-400 transition-transform duration-200 ${
                  tagsExpanded ? "rotate-90" : ""
                }`}
              />
            </button>

            {tagsExpanded && (
              <div className="mt-1 ml-4 space-y-0.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onViewChange(`tag:${tag}`)}
                    className={`sidebar-item w-full text-xs ${
                      activeTag === tag ? "sidebar-item-active" : ""
                    }`}
                  >
                    <span className="text-primary/70 font-mono">#</span>
                    <span className="flex-1 text-left truncate">{tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Keyboard shortcuts hint */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-[#2d3154]">
        <p className="text-[11px] text-slate-400 dark:text-slate-600 space-y-1">
          <span className="block">⌘N &nbsp;New note</span>
          <span className="block">⌘K &nbsp;Search</span>
          <span className="block">⌘S &nbsp;Save</span>
          <span className="block">Esc &nbsp;Close</span>
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
