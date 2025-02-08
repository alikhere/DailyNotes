import React from 'react'
import NoteCard from '../../components/Cards/NoteCard'

function Home() {
  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-md:m-8' >
        <NoteCard/>
        <NoteCard/>
        <NoteCard/>
        <NoteCard/>
        <NoteCard/>
      </div>
    </div>
  )
}

export default Home