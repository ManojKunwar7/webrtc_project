import { useMemo } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const socket = useMemo(
    () =>
      io("ws://localhost:4500", {
        transports: ["websocket"],
        autoConnect: false,
      }),
    []
  );
  
  return socket;
};
