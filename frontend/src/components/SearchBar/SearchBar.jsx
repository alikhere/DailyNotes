import React from 'react'
import {FaMagnifyingGlass} from 'react-icons/fa6'
import {IoMdClose} from 'react-icons/io'

const SearchBar = ({value, onChange,handleSearch, onClearSearch}) => {
  return (
    <div className='w-40 sm:w-60 md:w-80  flex items-center px-4 bg-slate-100 rounded-md'>
        <input  
        type="text" 
        placeholder='Search Notes...'  
        className=' w-full text-s bg-transparent py-[11px] outline-none '
        value={value}
        onChange={onChange}
        />
        { value &&  
        <IoMdClose onClick={onClearSearch} className='text-slate-500  text-xl cursor-pointer hover:text-black mr-3'
        />}
        <FaMagnifyingGlass 
        className='text-slate-500 text-xl hover:text-black mr-3 cursor-pointer'
        onClick={handleSearch}
        />
    </div>
    
  )
}

export default SearchBar