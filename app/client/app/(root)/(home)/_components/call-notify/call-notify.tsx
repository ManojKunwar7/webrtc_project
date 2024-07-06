"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SocketContext } from "@/context/socket/socket.Context";
import { useContext, useEffect, useState } from "react";

const CallNotify = () => {
  const {
    socket,
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
  }: any = useContext(SocketContext);
  // const [visible, setVisible] = useState(false);
  // const [caller, setCaller] = useState("");
  // const [callDeclined, setCallDeclined] = useState(false);
  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("call_receive", (user_id: string) => {
  //     // console.log("call by", data);
  //     setVisible(true);
  //     setCaller(user_id);
  //   });

  //   socket.on("call_decline", (data: any) => {
  //     console.log("call declined by ", data);
  //     setCallDeclined(true);
  //     setTimeout(() => {
  //       setIsCalling(false);
  //       setCallDeclined(false);
  //       setVisible(false);
  //     }, 1000);
  //   });

  //   socket.on("call_accepted", (data: any) => {
  //     const { user_id } = data;
  //     console.log("Call accepted", user_id);
  //   });
  // }, [socket]);

  const CallRejectHandler = (e: any) => {
    socket.emit("reject", { user_id: caller });
    setVisible(false);
    setCaller("");
  };

  const CallAcceptHandler = (e: any) => {
    socket.emit("call_accepted", { user_id: caller });
    setVisible(false);
  };

  return (
    <>
      {visible ? (
        <>
          {isCalling ? (
            <Card className="flex flex-col gap-5 p-5 absolute right-[1%] bottom-[1%]">
              {callDeclined ? (
                <p>Call Declined by {callers.join(", ")}</p>
              ) : (
                <>
                  <div>Calling {callers.join(", ")}</div>
                  <div className="flex flex-row gap-4">
                    <Button>Answer</Button>
                    <Button variant="destructive">Reject</Button>
                  </div>
                </>
              )}
            </Card>
          ) : (
            <Card className="flex flex-col gap-5 p-5 absolute right-[1%] bottom-[1%]">
              <div>Call from {caller}</div>
              <div className="flex flex-row gap-4">
                <Button onClick={CallAcceptHandler}>Answer</Button>
                <Button variant="destructive" onClick={CallRejectHandler}>
                  Reject
                </Button>
              </div>
            </Card>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CallNotify;
