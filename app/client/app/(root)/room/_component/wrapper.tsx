"use client";

import { ReactNode } from "react";

const RoomWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="h-full w-full">{children}</div>;
};

export default RoomWrapper;
