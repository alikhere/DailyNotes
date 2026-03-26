import { FaMagnifyingGlass } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io"

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="flex items-center gap-2 w-full bg-slate-100 dark:bg-[#1a1d2e] border border-slate-200 dark:border-[#2d3154] rounded-xl px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
      <FaMagnifyingGlass className="text-slate-400 dark:text-slate-500 text-sm shrink-0" />
      <input
        type="text"
        placeholder="Search notes..."
        className="flex-1 text-sm bg-transparent outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600"
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose
          onClick={onClear}
          className="text-slate-400 dark:text-slate-500 text-base cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors shrink-0"
        />
      )}
    </div>
  )
}

export default SearchBar
