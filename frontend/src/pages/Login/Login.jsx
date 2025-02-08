import React, { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput'
import {Link} from "react-router-dom"
import { validateEmail } from '../../utils/helper'



function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const handleLogin = async(e) => {
    e.preventDefault()
    if(!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    if(!password) {
      setError("Please enter the password")
      return
    }
    setError("")
    
    //loginAPI

  }

  return (
    <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded-md bg-white px-7 py-10'>
            <form onSubmit={handleLogin} action="">

              <h4 className='text-2xl mb-7'>Login</h4>
              <input type="text" placeholder='Email' 
              value={email}
              className='input-box' onChange={(e) => setEmail(e.target.value)} />

              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

              {error && <p className='text-red-500 text-sm pb-1'>{error}</p>}

            <button type='submit' className='btn-primary'>Log in</button>

            <p className='text-sm text-center mt-4'> Not registered yet?{" "}
              <Link to={"/signup"} className='font-medium text-[#2B85FF]'>Sign up</Link> 
            </p>
            </form>
        </div>
    </div>
  )
}

export default Login