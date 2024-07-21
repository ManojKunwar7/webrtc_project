import React from 'react'
import FindRoomForm from "./_component/find-form"

const OmegleIndex = () => {
  return (
    <div className='h-full w-full border flex justify-center'>
      <div className='pt-5 h-full flex flex-col gap-3'>
        <h3 className='text-6xl h-[20%]'>
          Fake Omegle
        </h3>
        <FindRoomForm />
      </div>
    </div>
  )
}

export default OmegleIndex