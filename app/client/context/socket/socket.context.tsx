"use client"

import { Socket, io } from "socket.io-client"
import { createContext, useContext, useEffect, useState } from "react"

interface iSocketContext {

}



export const SocketContext = createContext<iSocketContext | null>(null)

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io("ws://localhost:4500", { transports: ["websocket"] })
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);
    if (socket?.connected) onConnect();
    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [socket])

  useEffect(() => {
    if (!socket || !isSocketConnected) return
    console.log("Connection", socket.id);
  }, [isSocketConnected, socket])

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>
}

