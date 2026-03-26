import React, { useState, useRef, useEffect } from "react"
import { getInitials } from "../../utils/helper"
import { MdLogout, MdPerson } from "react-icons/md"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { signoutSuccess } from "../../redux/user/userSlice"
import axios from "axios"
import { toast } from "react-toastify"

const API_URL = import.meta.env.VITE_API_URL

const ProfileInfo = ({ userInfo }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const onLogout = async () => {
    setOpen(false)
    try {
      const res = await axios.get(`${API_URL}/api/auth/signout`, { withCredentials: true })
      toast.success(res.data.message)
      dispatch(signoutSuccess())
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed")
    }
  }

  if (!userInfo) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#222639] transition-colors"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 dark:bg-primary/25 text-primary dark:text-primary-hover text-sm font-semibold select-none">
          {getInitials(userInfo?.username)}
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
          {userInfo?.username}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-48 bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-[#2d3154] rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 py-1 z-50">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-[#2d3154]">
            <div className="flex items-center gap-2">
              <MdPerson className="text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {userInfo?.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                  {userInfo?.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <MdLogout />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileInfo
