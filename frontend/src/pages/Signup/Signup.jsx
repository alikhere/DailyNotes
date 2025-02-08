import React, { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput'
import {Link} from "react-router-dom"
import { validateEmail } from '../../utils/helper'



function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [name, setName] = useState("")

  const handleSignup = async(e) => {
    e.preventDefault()

    if(!name) {
      setError("Please enter your name")
      return
    }
    if(!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    if(!password) {
      setError("Please enter the password")
      return
    }
    setError("")
    
    //signupAPI

  }

  return (
    <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded-md bg-white px-7 py-10'>
            <form onSubmit={handleSignup} action="">

              <h4 className='text-2xl mb-7'>Sign Up</h4>

              <input type="text" placeholder='Name' className='input-box' value={name} onChange={(e) => setName(e.target.value)} />

              <input type="text" placeholder='Email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)} />

              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} 
              />

              {error && <p className='text-red-500 text-sm pb-1'>{error}</p>}

            <button type='submit' className='btn-primary'>Sign up</button>

            <p className='text-sm text-center mt-4'> Already have an account?{" "}
              <Link to={"/login"} className='font-medium text-[#2B85FF]'>Log in</Link> 
            </p>
            </form>
        </div>
    </div>
  )
}

export default Signup