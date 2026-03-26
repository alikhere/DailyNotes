import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Signup from "./pages/Signup/Signup"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider, useTheme } from "./context/ThemeContext"

const ToastWrapper = () => {
  const { isDark } = useTheme()
  return (
    <ToastContainer
      position="top-center"
      autoClose={2500}
      hideProgressBar={false}
      theme={isDark ? "dark" : "light"}
      toastClassName="!rounded-xl !text-sm"
    />
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <ToastWrapper />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
