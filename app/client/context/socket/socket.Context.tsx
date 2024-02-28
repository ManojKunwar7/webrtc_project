"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useSocket } from "./useSocket";
import { io } from "socket.io-client";
import { data } from "tailwindcss/defaultTheme";
// import { io } from "socket.io-client";

// type socket_type = null | any;
// const defaultSocketValues= {
//   socket: any,
// };

export const SocketContext: any = createContext(null);

export const SocketWrapper = ({ children }: { children: ReactNode }) => {
  // console.log("socket", socket);
  const [Websocket, setWebSocket] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callers, setCallers] = useState([]);
  const [callRejected, setcallRejected] = useState(false);
  useEffect(() => {
    const socket: any = io("ws://192.168.1.107:4500", {
      transports: ["websocket"],
    });
    // no-op if the socket is already connected
    setWebSocket(socket);
    socket.emit("message", "hey yo bro");

    socket.on("connect", () => {
      console.log("Connected", socket.id);
    });

    socket.on("message", (data: any) => {
      console.log("data", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: Websocket,
        isCalling,
        setIsCalling,
        callRejected,
        setcallRejected,
        callers,
        setCallers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const SocketWrapperConsumer = SocketContext.Consumer;
