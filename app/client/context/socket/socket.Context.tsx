"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useSocket } from "./useSocket";
import { io } from "socket.io-client";
import { toast } from "sonner";

// type socket_type = null | any;
// const defaultSocketValues= {
//   socket: any,
// };

export const SocketContext: any = createContext(null);

export const SocketWrapper = ({ children }: { children: ReactNode }) => {
  // console.log("socket", socket);
  const [Websocket, setWebSocket] = useState<any>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callers, setCallers] = useState([]);
  const [callRejected, setcallRejected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [caller, setCaller] = useState("");
  const [callDeclined, setCallDeclined] = useState(false);
  useEffect(() => {
    const socket: any = io("ws://localhost:4500", {
      transports: ["websocket"],
    });
    // no-op if the socket is already connected
    socket.emit("message", "hey yo bro");

    socket.on("connect", () => {
      setWebSocket(socket);
      console.log("Connected", socket.id);
    });

    socket.on("message", (data: any) => {
      console.log("data", data);
    });


    socket.on("call_receive", (user_id: string) => {
      // console.log("call by", data);
      setVisible(true);
      setCaller(user_id);
    });

    socket.on("call_decline", (data: any) => {
      console.log("call declined by ", data);
      toast.error(`Call Declined!  by ${data}`)
      setCallDeclined(true);
      setTimeout(() => {
        setIsCalling(false);
        setCallDeclined(false);
        setVisible(false);
      }, 1000);
    });

    socket.on("call_accepted", (data: any) => {
      const { user_id } = data;
      toast.error(`Call Accepted by ${user_id}`)
      console.log("Call accepted", user_id);
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
        visible,
        setVisible,
        caller,
        setCaller,
        callDeclined,
        setCallDeclined
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const SocketWrapperConsumer = SocketContext.Consumer;
