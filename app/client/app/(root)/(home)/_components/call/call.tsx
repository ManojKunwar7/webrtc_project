"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocketContext } from "@/context/socket/socket.Context";
import React, { useContext, useState } from "react";
import { toast } from "sonner";

const CallComponent = () => {
  const { socket, setCallers , setIsCalling}: any = useContext(SocketContext);
  const [callerId, setCallerId] = useState("");
  console.log("socket", socket);

  const CallHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!callerId) {
      toast.error("No Caller id added!");
      return;
    }
    socket.emit("call", { user_id: callerId });
    setCallers([callerId]);
    setIsCalling(true);
  };
  return (
    <div className="flex flex-row gap-4">
      <Input
        placeholder="Call a friend (Enter User Id)"
        onChange={(e: any) => setCallerId(e.target.value)}
      />
      <Button
        style={{ backgroundColor: "green", color: "white" }}
        onClick={CallHandler}
      >
        Call
      </Button>
    </div>
  );
};

export default CallComponent;
