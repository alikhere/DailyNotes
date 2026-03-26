import { MdSunny, MdNightlight, MdMenu } from "react-icons/md"
import SearchBar from "./SearchBar/SearchBar"
import ProfileInfo from "./Cards/ProfileInfo"
import { useTheme } from "../context/ThemeContext"

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSidebarToggle }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-4 bg-white dark:bg-[#13151f] border-b border-slate-200 dark:border-[#2d3154] z-10">
      {/* Mobile sidebar toggle */}
      <button
        onClick={onSidebarToggle}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222639] transition-colors"
      >
        <MdMenu className="text-xl" />
      </button>

      {/* Search — centered, live search handled by Home */}
      <div className="flex-1 max-w-md mx-auto">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#222639] transition-all"
        >
          {isDark ? (
            <MdSunny className="text-xl text-yellow-400" />
          ) : (
            <MdNightlight className="text-xl" />
          )}
        </button>

        {/* Profile */}
        <ProfileInfo userInfo={userInfo} />
      </div>
    </header>
  )
}

export default Navbar
