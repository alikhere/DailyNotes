import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import axios from "axios"
import { toast } from "react-toastify"
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdSunny, MdNightlight } from "react-icons/md"
import { useTheme } from "../../context/ThemeContext"

const API_URL = import.meta.env.VITE_API_URL

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!name.trim()) { setError("Please enter your name"); return }
    if (!validateEmail(email)) { setError("Please enter a valid email address"); return }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }

    setError("")
    setLoading(true)

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        { username: name.trim(), email, password },
        { withCredentials: true }
      )

      if (res.data.success === false) {
        setError(res.data.message)
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      navigate("/login")
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed"
      toast.error(msg)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0f1117] px-4">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="fixed top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-[#222639] shadow-sm transition-all z-10"
      >
        {isDark ? (
          <MdSunny className="text-xl text-yellow-400" />
        ) : (
          <MdNightlight className="text-xl" />
        )}
      </button>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-slate-400 dark:text-slate-500">Daily</span>
            <span className="text-primary">Notes</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-[#2d3154] rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name */}
            <div>
              <label className="input-label block mb-1.5">Full Name</label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-[#222639] border border-slate-200 dark:border-[#2d3154] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="input-label block mb-1.5">Email</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-[#222639] border border-slate-200 dark:border-[#2d3154] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="input-label block mb-1.5">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-[#222639] border border-slate-200 dark:border-[#2d3154] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center mt-5 text-slate-500 dark:text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
