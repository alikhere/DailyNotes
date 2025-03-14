import React, { useState } from 'react'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from "react-icons/md";
import Model from "react-modal"
import AddEditNotes from './AddEditNotes';

function Home() {
  const [openAddEditModel, setopenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null
  })
  return (
    <>
      <div className='container mx-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-md:m-8' >
          <NoteCard 
          title={"Wape up at 6 a.m"} 
          date={"5th June, 2021"} 
          content={"wake up for the college special event"} 
          tags={"#event"}
          isPinned={true} 
          onEdit={()=>{}} 
          onDelete={()=> {}} 
          onPinNote={()=> {}}
          />
          <NoteCard 
          title={"Wape up at 6 a.m"} 
          date={"5th June, 2021"} 
          content={"wake up for the college special event"} 
          tags={"#event"}
          isPinned={true} 
          onEdit={()=>{}} 
          onDelete={()=> {}} 
          onPinNote={()=> {}}
          />
          <NoteCard 
          title={"Wape up at 6 a.m"} 
          date={"5th June, 2021"} 
          content={"wake up for the college special event"} 
          tags={"#event"}
          isPinned={true} 
          onEdit={()=>{}} 
          onDelete={()=> {}} 
          onPinNote={()=> {}}
          />
          <NoteCard 
          title={"Wape up at 6 a.m"} 
          date={"5th June, 2021"} 
          content={"wake up for the college special event"} 
          tags={"#event"}
          isPinned={true} 
          onEdit={()=>{}} 
          onDelete={()=> {}} 
          onPinNote={()=> {}}
          />
          <NoteCard 
          title={"Wape up at 6 a.m"} 
          date={"5th June, 2021"} 
          content={"wake up for the college special event"} 
          tags={"#event"}
          isPinned={true} 
          onEdit={()=>{}} 
          onDelete={()=> {}} 
          onPinNote={()=> {}}
          />
          <NoteCard 
          title={"Wape up at 6 a.m"} 
          date={"5th June, 2021"} 
          content={"wake up for the college special event"} 
          tags={"#event"}
          isPinned={true} 
          onEdit={()=>{}} 
          onDelete={()=> {}} 
          onPinNote={()=> {}}
          />

        </div>
      </div>

      <div className='flex items-center justify-end mr-12 mt-12'>
        <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600  bottom-10' onClick={()=>{
          setopenAddEditModel({isShown: true, type: "add", data: null})
        }}>
          <MdAdd className='text-[32px] text-white'/>
        </button>
      </div>

      <Model isOpen = {openAddEditModel.isShown} onRequestClose={()=> {}} style={{ overlay: {
        backgroundColor: "rgba(0,0,0,0.2)",
      },
      }}
      contentLabel=''
      className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto">
        <AddEditNotes onClose={()=> setopenAddEditModel({isShown: false, type: "add", data: null})} 
        noteData={openAddEditModel.data}
        type={openAddEditModel.type}
        />

      </Model>
      
    </>
  )
}

export default Home