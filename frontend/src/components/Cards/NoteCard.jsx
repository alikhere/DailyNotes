import React from 'react'
import {MdCreate, MdDelete, MdOutlinePushPin} from "react-icons/md"

function NoteCard({isPinned ,onPinNote, content, onEdit}) {
  return (
    <div>
        <div className='flex items-center justify-between'>
            <div >
                <h6 className='text-sm font-medium'>Wape up at 6 a.m</h6>
                <span className='text-sm text-green-700'>12th jun, 2024</span>

            </div>
            <div>
                <MdOutlinePushPin className={
                    ` icon-btn ${ isPinned ? "text=[#2B85FF]" : "text-slate-700"}`
                } onClick={onPinNote}/>
            </div>
        </div>
        <p className='text-xs text-slate-600 mt-2 '> {content?.slice(0,60)} Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur tempore eveniet blanditiis ad ipsam repellendus quaerat libero laudantium dolor dolorem assumenda eum quibusdam delectus, deserunt, excepturi voluptatibus facere repellat soluta? </p>

        <div className='flex items-center justify-between mt-2'>
            <div className='text-xs text-slate-500 '>#tags </div>
            <div className='flex items-center gap-8'>
                <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit} />
                <MdDelete />
            </div>
        </div>
    </div>
  )
}

export default NoteCard