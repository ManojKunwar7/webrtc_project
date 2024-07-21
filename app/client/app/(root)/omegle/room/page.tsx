
import React from 'react'
import VideoPanel from "./_component/video-panel"
import ChatPanel from './_component/chat-panel'
const FindRoomIndex = (pageProps: any) => {
  const { searchParams } = pageProps
  return (
    <div className='h-full w-full flex items-center gap-1'>
      <VideoPanel />
      <ChatPanel />
 
    </div>
  )
}

export default FindRoomIndex