import { MdNotes, MdSearchOff, MdArchive, MdDelete } from "react-icons/md"

const EMPTY_STATES = {
  search: {
    icon: MdSearchOff,
    title: "No results found",
    subtitle: "Try different keywords or clear the search",
  },
  archived: {
    icon: MdArchive,
    title: "No archived notes",
    subtitle: "Archived notes will appear here",
  },
  trash: {
    icon: MdDelete,
    title: "Trash is empty",
    subtitle: "Deleted notes will appear here",
  },
  default: {
    icon: MdNotes,
    title: "No notes yet",
    subtitle: 'Press Ctrl+N or click "New Note" to get started',
  },
}

const EmptyCard = ({ type = "default" }) => {
  const state = EMPTY_STATES[type] || EMPTY_STATES.default
  const Icon = state.icon

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#222639] flex items-center justify-center mb-4">
        <Icon className="text-3xl text-slate-400 dark:text-slate-600" />
      </div>
      <h3 className="text-base font-medium text-slate-600 dark:text-slate-400 mb-1">
        {state.title}
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-600 max-w-xs">{state.subtitle}</p>
    </div>
  )
}

export default EmptyCard