import React, { useState } from 'react'
import SearchBar from './SearchBar/SearchBar'
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const handleSearch = () => {
    }

    const onClearSearch = () => {
        setSearchQu
        ery("")
    }
    const onLogout = () => {
        navigate("/Login")
    }
  return (
    <div className='bg-white flex justify-between items-center px-6 py-2 drop-shadow'>
        <h2 className='text-xl font-medium text-black py-2'>
            <span
             className='text-slate-500'>Daily
             </span>
            <span
             className='text-slate-900'>Notes
             </span>
        </h2>
        <SearchBar value = {searchQuery} onChange = {(e) => setSearchQuery(e.target.value)}/>
        <ProfileInfo onLogout={onLogout}/>
    </div>
  )
}

export default Navbar