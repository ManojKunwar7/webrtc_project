"use client"
import React, { useContext, useEffect, useState } from 'react'
import VideoItem from "./video-item"
import { SocketContext, iceServers, streamConstraints } from '@/context/socket/socket.Context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const VideoPanel = (props: any) => {
  const router = useRouter()
  const { inCall, setInCall, room, socket, localStream, setLocalStream, remoteStream, setRemoteStream, rtcPeerConnection, setRtcPeerConnection, dataChannel, setDataChannel, dataChannelMsg, setDataChannelMsg }: any = useContext(SocketContext)
  console.log("room", room);
  useEffect(() => {
    if (!inCall) {
      router.push("/omegle");
    }
  }, [inCall, router, setInCall])

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
    if (!socket) return
    socket.on("mesh:ready", async () => {
      try {
        const streamResp: any = await getPermission();
        setLocalStream(streamResp);
        // const rtcPeerConnectionInstance = new window.RTCPeerConnection({ iceServers: iceServers.iceServer });
        // rtcPeerConnectionInstance.onicecandidate = onIceCandidate;
        // rtcPeerConnectionInstance.ontrack = onAddStream;
        // console.log('localStream mesh:ready', streamResp);
        // rtcPeerConnectionInstance.addTrack(streamResp.getTracks()[0], streamResp);
        // rtcPeerConnectionInstance.addTrack(streamResp.getTracks()[1], streamResp);
        // rtcPeerConnectionInstance.createOffer().then((sdp) => {
        //   rtcPeerConnectionInstance.setLocalDescription(sdp).then(sdp => {
        //     setRtcPeerConnection((prev: any) => (rtcPeerConnectionInstance));
        //     socket.emit("mesh:offer", {
        //       type: "offer",
        //       sdp,
        //       room
        //     })
        //   });
        // })
        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.ontrack = onAddStream;
        console.log('localStream mesh:ready', streamResp);
        rtcPeerConnection.addTrack(streamResp.getTracks()[0], streamResp);
        rtcPeerConnection.addTrack(streamResp.getTracks()[1], streamResp);
        let dc: any = rtcPeerConnection.createDataChannel(room)
        dc.onmessage = onDataMessage
        setDataChannel(dc)
        rtcPeerConnection.createOffer().then((sdp: any) => {
          rtcPeerConnection.setLocalDescription(sdp).then(() => {
            setRtcPeerConnection((prev: any) => (rtcPeerConnection));
            socket.emit("mesh:offer", {
              type: "offer",
              sdp,
              room
            })
          });
        })
      } catch (err) {
        console.log("mesh:ready", err);
      }
    })


    socket.on("mesh:offer", async (offer: any) => {
      try {
        console.log("offer mesh offer", offer);
        // setLocalStream
        const streamResp: any = await getPermission();
        setLocalStream(streamResp);
        // const rtcPeerConnectionInstance = new RTCPeerConnection({ iceServers: iceServers.iceServer });
        // rtcPeerConnectionInstance.ontrack = onAddStream;
        // rtcPeerConnectionInstance.onicecandidate = onIceCandidate;
        // rtcPeerConnectionInstance.addTrack(streamResp.getTracks()[0], streamResp);
        // rtcPeerConnectionInstance.addTrack(streamResp.getTracks()[1], streamResp);
        // // await rtcPeerConnectionInstance.setRemoteDescription(new RTCSessionDescription(offer));
        // // const sdp = await rtcPeerConnectionInstance.createAnswer()
        // // await rtcPeerConnectionInstance.setLocalDescription(sdp);
        // // console.log("create answer:sdp",sdp);

        // rtcPeerConnectionInstance.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
        //   rtcPeerConnectionInstance.createAnswer().then(sdp => {
        //     rtcPeerConnectionInstance.setLocalDescription(sdp).then(() => {
        //       setRtcPeerConnection((prev: any) => (rtcPeerConnectionInstance));
        //       socket.emit("mesh:answer", {
        //         type: "answer",
        //         sdp,
        //         room,
        //       })
        //     })
        //   }).catch(error => console.log("rtcPeerConnectionInstance.createAnswer", error))
        // }).catch(error => console.log("rtcPeerConnectionInstance.setRemoteDescription", error))
        rtcPeerConnection.ontrack = onAddStream;
        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.addTrack(streamResp.getTracks()[0], streamResp);
        rtcPeerConnection.addTrack(streamResp.getTracks()[1], streamResp);
        // await rtcPeerConnectionInstance.setRemoteDescription(new RTCSessionDescription(offer));
        // const sdp = await rtcPeerConnectionInstance.createAnswer()
        // await rtcPeerConnectionInstance.setLocalDescription(sdp);
        // console.log("create answer:sdp",sdp);
        rtcPeerConnection.ondatachannel = (event:any)=>{
          let dc = event.chanel;
          dc.onmessage = 
          setDataChannel(dc)
        }

        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
          rtcPeerConnection.createAnswer().then((sdp: any) => {
            rtcPeerConnection.setLocalDescription(sdp).then(() => {
              setRtcPeerConnection((prev: any) => (rtcPeerConnection));
              socket.emit("mesh:answer", {
                type: "answer",
                sdp,
                room,
              })
            })
          }).catch((error: any) => console.log("rtcPeerConnectionInstance.createAnswer", error))
        }).catch((error: any) => console.log("rtcPeerConnectionInstance.setRemoteDescription", error))

      
      } catch (err) {
        console.log("mesh:offer", err);
      }
    })


    socket.on("mesh:answer", async (sdp: any) => {
      if (!rtcPeerConnection) return
      if (!sdp) return
      await rtcPeerConnection?.setRemoteDescription(new RTCSessionDescription(sdp));
    })

    socket.on("mesh:candidate", async (event: any) => {
      if (!rtcPeerConnection) return
      const candidate = new RTCIceCandidate({
        candidate: event.candidate,
        sdpMLineIndex: event.label
      })
      if (!candidate) return
      await rtcPeerConnection.addIceCandidate(candidate);
    })

    const onAddStream = (event: any) => {
      setRemoteStream(event.streams[0])
    }

    const onIceCandidate = (event: any) => {
      try {
        if (event.candidate) {
          socket.emit("mesh:candidate", {
            type: "candidate",
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            room
          })
        }
      } catch (err) {
        console.log("onIceCandidate err", err)
      }
    }

    const onDataMessage = (event: any) => {
      setDataChannelMsg((prev: any) => ([...prev, event.data]))
    }
    // return () => {
    //   socket.disconnect();
    // };
  }, [socket, localStream, room, rtcPeerConnection, setRtcPeerConnection, setRemoteStream, setLocalStream, setDataChannel, setDataChannelMsg])

  return (
    <div className='w-[50%] h-full border flex flex-col gap-1 p-2'>
      <div className='h-[50%] w-full border'>
        {/* Another */}
        <VideoItem stream={remoteStream} />
      </div>
      <div className='h-[50%] w-full border'>
        {/* me */}
        <VideoItem stream={localStream} />
      </div>
    </div>
  )
}

export default VideoPanel