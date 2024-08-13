"use client"
import React, { useContext, useEffect, useState } from 'react'
import VideoItem from "./video-item"
import { SocketContext } from '@/context/socket/socket.context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { streamConstraints, iceServers } from '@/modules/constant';

const VideoPanel = (props: any) => {
  const router = useRouter()
  const { inCall, setInCall, room, socket, localStream, setLocalStream, remoteStream, setRemoteStream, rtcPeerConnection, setRtcPeerConnection, dataChannel, setDataChannel, dataChannelMsg, setDataChannelMsg }: any = useContext(SocketContext)
  useEffect(() => {
    if (!localStream && !inCall) {
      console.log(" checking", localStream);
      router.push("/omegle");
    }
  }, [inCall, localStream, router, setInCall, setLocalStream])

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
    const onReady = () => {
      try {
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
        // console.log('localStream mesh:ready', streamResp);

        // let dc: any = rtcPeerConnection.createDataChannel(room)
        // dc.onmessage = onDataMessage
        // setDataChannel(dc)

        rtcPeerConnection.createOffer().then((sdp: any) => {
          console.log("here 2");

          rtcPeerConnection.onicecandidate = onIceCandidate;
          rtcPeerConnection.ontrack = onAddStream;
          rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
          rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
          rtcPeerConnection.setLocalDescription(sdp).then(() => {
            rtcPeerConnection.onnegotiationneeded = (e: any) => {
              if (rtcPeerConnection.signalingState != "stable") return;
            }
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
    }
    socket.on("mesh:ready", async () => onReady);

    const onOffer = (offer: any) => {
      try {
        // setLocalStream
        // const streamResp: any = await getPermission();
        // setLocalStream(streamResp);
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

        // await rtcPeerConnectionInstance.setRemoteDescription(new RTCSessionDescription(offer));
        // const sdp = await rtcPeerConnectionInstance.createAnswer()
        // await rtcPeerConnectionInstance.setLocalDescription(sdp);
        // console.log("create answer:sdp",sdp);


        // rtcPeerConnection.ondatachannel = (event:any)=>{
        //   let dc = event.chanel;
        //   dc.onmessage = 
        //   setDataChannel(dc)
        // }

        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
          console.log("here 1");
          rtcPeerConnection.ontrack = onAddStream;
          rtcPeerConnection.onicecandidate = onIceCandidate;
          rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
          rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
          rtcPeerConnection.createAnswer().then((sdp: any) => {
            rtcPeerConnection.onnegotiationneeded = (e: any) => {
              if (rtcPeerConnection.signalingState != "stable") return;
            }
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
    }

    socket.on("mesh:offer", async (offer: any) => { onOffer(offer) })

    const onAnswer = (sdp: any) => {
      return new Promise(async (resolve, reject) => {
        if (!rtcPeerConnection) return reject({ status: false });
        if (!sdp) return reject({ status: false });
        rtcPeerConnection?.setRemoteDescription(new RTCSessionDescription(sdp)).then(() => {
          return resolve({ status: true })
        }).catch((err: any) => {
          return reject(err);
        });
      })
    }

    socket.on("mesh:answer", async (sdp: any) => { onAnswer(sdp) })
    const onCandidate = (event: any) => {
      return new Promise(async (resolve, reject) => {
        if (!rtcPeerConnection) return reject({ status: false });
        const candidate = new RTCIceCandidate({
          candidate: event.candidate,
          sdpMLineIndex: event.label
        })
        if (!candidate) return
        rtcPeerConnection.addIceCandidate(candidate).then(() => {
          return resolve({ status: true })
        }).catch((err: any) => {
          return reject(err);
        });
      })
    }
    socket.on("mesh:candidate", async (event: any) => (onCandidate(event)))

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
    //   socket.off("mesh:ready", async () => onReady);
    //   socket.off("mesh:offer", async (offer: any) => {onOffer(offer)})
    //   socket.off("mesh:candidate", async (event: any) => ( onCandidate(event)))
    // };
  }, [localStream, room, rtcPeerConnection, setDataChannelMsg, setRemoteStream, setRtcPeerConnection, socket])

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