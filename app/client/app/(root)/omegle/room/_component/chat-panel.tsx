"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SocketContext } from '@/context/socket/socket.context'
import { Send } from '@mui/icons-material'
import React, { useContext, useState } from 'react'
import { toast } from 'sonner'

const ChatPanel = () => {
  const {
    dataChannelMsg, setDataChannelMsg,
    dataChannel, setDataChannel,
  }: any = useContext(SocketContext);
  const [text, setText] = useState("")
  const onSendMessage = () => {
    
    if (!text) {
      toast.info("Enter message before sending...")
      return
    }

      console.log("text", text);
  }
  const onInputTextArea = (e: any) => {
    setText(e.target.value)
  }
  return (
    <div className='w-[50%] h-full border p-2 flex flex-col gap-1'>
      <div className='border w-full h-[90%]'>
        {dataChannelMsg?.map((item: any, idx: number) => {
          return <div key={idx}>{JSON.stringify(item)}</div>
        })}
      </div>
      <div className='border w-full h-[10%] flex gap-2'>
        <div className='w-[80%] h-full'><Textarea onInput={onInputTextArea} /></div>
        <div className='w-[20%] h-full'><Button onClick={onSendMessage}>Send <Send /></Button></div>
      </div>
    </div>
  )
}

export default ChatPanel