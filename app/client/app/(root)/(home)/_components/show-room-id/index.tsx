"use client"

import { SocketContext } from '@/context/socket/socket.context'
import React, { useContext, useEffect, useState } from 'react'

const ShowRoomId = () => {
  const { socket }: any = useContext(SocketContext)
  const [socketId, setSocketId] = useState("")
  useEffect(() => {
    if (socket && "id" in socket && socket.id) {
      setSocketId(socket.id)
    }
  }, [socket])
  return (
    <div>{socketId}</div>
  )
}

export default ShowRoomId