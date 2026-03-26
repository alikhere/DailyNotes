import React, { useState } from "react"
import {
  MdOutlinePushPin,
  MdPushPin,
  MdCreate,
  MdDelete,
  MdArchive,
  MdUnarchive,
  MdContentCopy,
  MdRestore,
  MdDeleteForever,
} from "react-icons/md"
import moment from "moment"
import { getColorClasses, stripMarkdown } from "../../utils/helper"

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onPinNote,
  onArchive,
  onDuplicate,
  onRestore,
  onPermanentDelete,
  isTrash = false,
  isArchived = false,
}) => {
  const [actionsVisible, setActionsVisible] = useState(false)

  const { title, content, tags, isPinned, color, createdAt, updatedAt } = note
  const colorClasses = getColorClasses(color || "default")

  const plainContent = stripMarkdown(content)
  const preview = plainContent.length > 150 ? plainContent.slice(0, 150) + "…" : plainContent

  const timeAgo = moment(updatedAt || createdAt).fromNow()
  const exactDate = moment(createdAt).format("MMM D, YYYY")

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all duration-200 group ${colorClasses.bg} ${colorClasses.border} shadow-card-light dark:shadow-card-dark hover:shadow-card-hover-light dark:hover:shadow-card-hover-dark hover:-translate-y-0.5`}
      onMouseEnter={() => setActionsVisible(true)}
      onMouseLeave={() => setActionsVisible(false)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 flex-1">
          {title}
        </h3>
        {!isTrash && (
          <button
            onClick={(e) => { e.stopPropagation(); onPinNote() }}
            title={isPinned ? "Unpin" : "Pin"}
            className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {isPinned ? (
              <MdPushPin className="text-base text-primary" />
            ) : (
              <MdOutlinePushPin className="text-base text-slate-400 dark:text-slate-600 hover:text-primary transition-colors" />
            )}
          </button>
        )}
      </div>

      {/* Content preview */}
      {preview && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-4">
          {preview}
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="tag-pill">
              #{tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">+{tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <time
          title={exactDate}
          className="text-[11px] text-slate-400 dark:text-slate-600"
        >
          {timeAgo}
        </time>

        {/* Action buttons */}
        <div
          className={`flex items-center gap-1 transition-all duration-150 ${
            actionsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {isTrash ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onRestore() }}
                title="Restore"
                className="p-1.5 rounded-lg text-slate-400 hover:text-green-500 hover:bg-green-500/10 transition-colors text-base"
              >
                <MdRestore />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onPermanentDelete() }}
                title="Delete permanently"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors text-base"
              >
                <MdDeleteForever />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit() }}
                title="Edit"
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors text-base"
              >
                <MdCreate />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate() }}
                title="Duplicate"
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors text-base"
              >
                <MdContentCopy />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onArchive() }}
                title={isArchived ? "Unarchive" : "Archive"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 transition-colors text-base"
              >
                {isArchived ? <MdUnarchive /> : <MdArchive />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                title="Move to trash"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors text-base"
              >
                <MdDelete />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoteCard
