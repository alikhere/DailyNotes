import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import { useDispatch } from "react-redux"
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice"
import axios from "axios"
import { toast } from "react-toastify"
import { MdLock, MdEmail, MdVisibility, MdVisibilityOff, MdSunny, MdNightlight } from "react-icons/md"
import { useTheme } from "../../context/ThemeContext"

const API_URL = import.meta.env.VITE_API_URL

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { isDark, toggleTheme } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!password) {
      setError("Please enter your password")
      return
    }

    setError("")
    setLoading(true)

    try {
      dispatch(signInStart())
      const res = await axios.post(
        `${API_URL}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      )

      if (!res.data.success) {
        toast.error(res.data.message)
        dispatch(signInFailure(res.data.message))
        return
      }

      toast.success(res.data.message)
      dispatch(signInSuccess(res.data))
      navigate("/")
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed"
      toast.error(msg)
      dispatch(signInFailure(msg))
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
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Welcome back</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-[#2d3154] rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-[#222639] border border-slate-200 dark:border-[#2d3154] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-center mt-5 text-slate-500 dark:text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
