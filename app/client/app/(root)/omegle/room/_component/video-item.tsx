"use client"
import React, { RefObject, useEffect, useRef } from 'react'

const VideoItem = (props: any) => {
  const { stream } = props
  const videoRef: any = useRef(null);
  useEffect(() => {
    if (!stream) {
      videoRef.current.srcObject = null;
      return;
    }
    videoRef.current.srcObject = stream;
  }, [stream])
  return (
    <div className='w-full h-full'>
      <video className='w-full h-full' ref={videoRef} autoPlay muted></video>
    </div>
  )
}

export default VideoItem