"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChangeEvent, ReactEventHandler, useState } from "react";

const JoinRoomComponent = () => {
  const [room, setRoom] = useState("");

  const InputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRoom(e.currentTarget.value);
  };

  return (
    <div className="flex flex-row gap-4">
      <Input placeholder="Enter a room Id" onChange={InputHandler} />
      <Link href={`/room?id=${room}`}>
        <Button>Join Room</Button>
      </Link>
    </div>
  );
};

export default JoinRoomComponent;
