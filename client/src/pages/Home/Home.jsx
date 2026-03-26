import { useEffect, useState, useRef } from "react"
import NoteCard from "../../components/Cards/NoteCard"
import { MdSort } from "react-icons/md"
import Modal from "react-modal"
import AddEditNotes from "./AddEditNotes"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import axios from "axios"
import { toast } from "react-toastify"
import EmptyCard from "../../components/EmptyCard/EmptyCard"

Modal.setAppElement("#root")

const API_URL = import.meta.env.VITE_API_URL

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "updated", label: "Last updated" },
  { value: "title-asc", label: "Title A → Z" },
  { value: "title-desc", label: "Title Z → A" },
]

const Home = () => {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState(null)
  const [allNotes, setAllNotes] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeView, setActiveView] = useState("all") // all | pinned | tag:X | archived | trash
  const [sortBy, setSortBy] = useState("newest")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [allTags, setAllTags] = useState([])
  const searchInputRef = useRef(null)
  const sortMenuRef = useRef(null)

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
    } else {
      setUserInfo(currentUser?.user)
    }
  }, [currentUser])

  // Fetch notes whenever view or sort changes (but not during active search)
  useEffect(() => {
    if (!currentUser) return
    if (isSearch) return
    fetchNotes()
  }, [activeView, sortBy, isSearch])

  // Live search: debounce 300ms on every keystroke; restore notes when query is cleared
  useEffect(() => {
    if (!currentUser) return

    if (!searchQuery.trim()) {
      // Query was cleared — restore normal view
      if (isSearch) setIsSearch(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/note/search`, {
          params: { query: searchQuery.trim() },
          withCredentials: true,
        })
        if (res.data.success === false) return
        setIsSearch(true)
        setAllNotes(res.data.notes)
      } catch (_e) { /* ignore transient errors */ }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close sort menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      // Don't fire when typing in inputs/textareas
      const tag = document.activeElement?.tagName
      const inInput = tag === "INPUT" || tag === "TEXTAREA"

      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault()
        openNewNote()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        // Focus search input in navbar
        document.querySelector('input[placeholder*="Search"]')?.focus()
      }

      if (e.key === "Escape") {
        if (openAddEditModal.isShown) {
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        } else if (searchQuery) {
          setSearchQuery("") // live-search effect handles restoring notes
        }
        setSidebarOpen(false)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [openAddEditModal.isShown, isSearch])

  const fetchNotes = async () => {
    try {
      let res
      if (activeView === "archived") {
        res = await axios.get(`${API_URL}/api/note/archived`, { withCredentials: true })
      } else if (activeView === "trash") {
        res = await axios.get(`${API_URL}/api/note/trashed`, { withCredentials: true })
      } else {
        const params = { sort: sortBy }
        if (activeView === "pinned") params.pinned = true
        if (activeView.startsWith("tag:")) params.tag = activeView.slice(4)

        res = await axios.get(`${API_URL}/api/note/all`, {
          params,
          withCredentials: true,
        })

        // Client-side filter for pinned view (backend sorts by pin, but we filter here)
        if (activeView === "pinned") {
          res.data.notes = res.data.notes.filter((n) => n.isPinned)
        }
      }

      if (res.data.success === false) return

      const notes = res.data.notes || []
      setAllNotes(notes)

      // Extract unique tags from all notes (fetch from "all" endpoint always)
      if (activeView !== "archived" && activeView !== "trash") {
        const tags = [...new Set(notes.flatMap((n) => n.tags || []))]
        setAllTags(tags)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Also fetch all tags from the main note list for sidebar
  useEffect(() => {
    const fetchTags = async () => {
      if (!currentUser) return
      try {
        const res = await axios.get(`${API_URL}/api/note/all`, {
          params: { sort: "newest" },
          withCredentials: true,
        })
        if (res.data.success !== false) {
          const tags = [...new Set((res.data.notes || []).flatMap((n) => n.tags || []))]
          setAllTags(tags)
        }
      } catch (_e) { /* ignore tag fetch errors */ }
    }
    fetchTags()
  }, [currentUser, activeView])

  // Called after CRUD operations — clears any active search and refreshes the note list
  const getAllNotes = () => {
    setSearchQuery("")  // triggers live-search effect which restores notes if isSearch was true
    setIsSearch(false)
    fetchNotes()        // direct call for immediate refresh when isSearch was already false
  }

  const openNewNote = () => {
    setOpenAddEditModal({ isShown: true, type: "add", data: null })
  }

  const handleEdit = (note) => {
    setOpenAddEditModal({ isShown: true, data: note, type: "edit" })
  }

  const trashNote = async (note) => {
    try {
      const res = await axios.delete(`${API_URL}/api/note/delete/${note._id}`, {
        withCredentials: true,
      })
      if (res.data.success === false) { toast.error(res.data.message); return }
      toast.success("Note moved to trash")
      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed")
    }
  }

  const permanentDelete = async (note) => {
    try {
      const res = await axios.delete(`${API_URL}/api/note/permanent/${note._id}`, {
        withCredentials: true,
      })
      if (res.data.success === false) { toast.error(res.data.message); return }
      toast.success("Note permanently deleted")
      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed")
    }
  }

  const restoreNote = async (note) => {
    try {
      const res = await axios.put(`${API_URL}/api/note/restore/${note._id}`, {}, {
        withCredentials: true,
      })
      if (res.data.success === false) { toast.error(res.data.message); return }
      toast.success("Note restored")
      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed")
    }
  }

  const archiveNote = async (note) => {
    try {
      const res = await axios.put(`${API_URL}/api/note/archive/${note._id}`, {}, {
        withCredentials: true,
      })
      if (res.data.success === false) { toast.error(res.data.message); return }
      toast.success(res.data.message)
      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed")
    }
  }

  const duplicateNote = async (note) => {
    try {
      const res = await axios.post(`${API_URL}/api/note/duplicate/${note._id}`, {}, {
        withCredentials: true,
      })
      if (res.data.success === false) { toast.error(res.data.message); return }
      toast.success("Note duplicated")
      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed")
    }
  }

  const updateIsPinned = async (note) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/note/update-note-pinned/${note._id}`,
        { isPinned: !note.isPinned },
        { withCredentials: true }
      )
      if (res.data.success === false) { toast.error(res.data.message); return }
      toast.success(res.data.message)
      fetchNotes()
    } catch (error) {
      console.error(error)
    }
  }

  const handleViewChange = (view) => {
    setActiveView(view)
    setIsSearch(false)
    setSearchQuery("")
    setSidebarOpen(false)
  }

  const viewLabel = () => {
    if (isSearch) return `Search: "${searchQuery}"`
    if (activeView === "all") return "All Notes"
    if (activeView === "pinned") return "Pinned"
    if (activeView === "archived") return "Archive"
    if (activeView === "trash") return "Trash"
    if (activeView.startsWith("tag:")) return `#${activeView.slice(4)}`
    return "Notes"
  }

  const isTrashView = activeView === "trash"
  const isArchivedView = activeView === "archived"

  // Pinned notes section (only for "all" view, not during search)
  const pinnedNotes = (!isSearch && activeView === "all")
    ? allNotes.filter((n) => n.isPinned)
    : []
  const unpinnedNotes = (!isSearch && activeView === "all")
    ? allNotes.filter((n) => !n.isPinned)
    : allNotes

  const totalCount = allNotes.length

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-[#0f1117]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-30 lg:z-auto h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
          activeView={isSearch ? "all" : activeView}
          onViewChange={handleViewChange}
          allTags={allTags}
          onNewNote={openNewNote}
          noteCount={totalCount}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          userInfo={userInfo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSidebarToggle={() => setSidebarOpen((p) => !p)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {viewLabel()}
                </h2>
                {totalCount > 0 && (
                  <span className="text-xs text-slate-400 dark:text-slate-600 font-mono bg-slate-200 dark:bg-[#222639] px-2 py-0.5 rounded-full">
                    {totalCount}
                  </span>
                )}
              </div>

              {/* Sort controls — only for non-trash, non-archived */}
              {!isTrashView && !isArchivedView && !isSearch && (
                <div className="relative" ref={sortMenuRef}>
                  <button
                    onClick={() => setShowSortMenu((p) => !p)}
                    className="flex items-center gap-1.5 btn-secondary text-xs"
                  >
                    <MdSort className="text-base" />
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                  </button>
                  {showSortMenu && (
                    <div className="absolute right-0 top-9 w-44 bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-[#2d3154] rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 py-1 z-10">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setShowSortMenu(false) }}
                          className={`w-full text-left text-sm px-3 py-2 transition-colors ${
                            sortBy === opt.value
                              ? "text-primary bg-primary/5"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#222639]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Trash controls */}
              {isTrashView && allNotes.length > 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-600">
                  Notes are deleted after 30 days
                </span>
              )}
            </div>

            {/* Notes grid */}
            {allNotes.length === 0 ? (
              <EmptyCard
                type={
                  isSearch ? "search" : isArchivedView ? "archived" : isTrashView ? "trash" : "default"
                }
              />
            ) : (
              <div className="space-y-6">
                {/* Pinned section */}
                {pinnedNotes.length > 0 && (
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-3">
                      Pinned
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {pinnedNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          onEdit={() => handleEdit(note)}
                          onDelete={() => trashNote(note)}
                          onPinNote={() => updateIsPinned(note)}
                          onArchive={() => archiveNote(note)}
                          onDuplicate={() => duplicateNote(note)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Regular notes */}
                {unpinnedNotes.length > 0 && (
                  <section>
                    {pinnedNotes.length > 0 && (
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-3">
                        Others
                      </h3>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {unpinnedNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          isTrash={isTrashView}
                          isArchived={isArchivedView}
                          onEdit={() => handleEdit(note)}
                          onDelete={() => trashNote(note)}
                          onPinNote={() => updateIsPinned(note)}
                          onArchive={() => archiveNote(note)}
                          onDuplicate={() => duplicateNote(note)}
                          onRestore={() => restoreNote(note)}
                          onPermanentDelete={() => permanentDelete(note)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 50,
          },
          content: {
            border: "none",
            background: "none",
            inset: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        contentLabel="Note editor"
      >
        <div className="w-full max-w-2xl mx-4 bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-[#2d3154] rounded-2xl shadow-2xl flex flex-col"
          style={{ maxHeight: "85vh", height: "85vh" }}
        >
          <div className="flex-1 min-h-0 p-6 flex flex-col">
            <AddEditNotes
              onClose={() =>
                setOpenAddEditModal({ isShown: false, type: "add", data: null })
              }
              noteData={openAddEditModal.data}
              type={openAddEditModal.type}
              getAllNotes={getAllNotes}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Home
