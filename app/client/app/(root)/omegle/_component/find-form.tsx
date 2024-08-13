"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SocketContext } from "@/context/socket/socket.context";
import { usePathname } from "next/navigation";
import { streamConstraints } from "@/modules/constant";




const FindRoomForm = () => {
  const pathname = usePathname();
  const {username, setUsername, inCall, setInCall, socket, localStream, setLocalStream, room, setRoom }: any = useContext(SocketContext);

  const onSubmitHandler = async () => {
    try {
      if (!room) {
        toast("Room name cannot be empty!",)
        return;
      }
      const streamResp = await getPermission();
      setLocalStream(streamResp);
      setInCall(true);
      socket.emit("mesh:createOrJoinRoom", { room: room, username })
    } catch (err) {
      console.log("something went wrong", err);
      toast.error("Something went wrong!");
    }
  }

  const getPermission = async () => {
    try {
      const streamResp = await navigator.mediaDevices.getUserMedia(streamConstraints);
      return streamResp;
    } catch (err) {
      console.log("err: unable to get user media permission", err)
      toast("Allow access camera and audio option!")
      return null;
    }
  }


  useEffect(() => {
    const init = async () => {
      if (pathname == "/omegle" && localStream) {
        console.log("here", localStream);
        
        localStream?.getTracks().forEach(function (track: any) {
          track.stop();
        });
        setInCall(false);
        setLocalStream(null);
      };
    }
    init();
  }, []);


  return (
    <div className="flex h-[80%] flex-col gap-4">
      <div>
        <Input placeholder="Enter user name..." onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value?.trim()) }} />
      </div>
      <div>
        <Input placeholder="Enter room name..." onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setRoom(e.target.value?.trim()) }} />
      </div>
      <div>
        <Button size="sm" onClick={onSubmitHandler}>Find or create</Button>
      </div>
    </div>
  );
};

export default FindRoomForm;
