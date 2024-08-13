import { Socket } from "socket.io";
import { io } from "../server";

io.on("connection", (socket: Socket) => {
  console.log("Connection started", socket.id);
  socket.on("connect", () => {
    console.log("Connection started 1", socket.id);
  });

  socket.on("message", (data) => {
    console.log("message from %s", socket.id, data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected ", socket.id);
  });

  socket.on("call", (data: any) => {
    const { user_id } = data;
    io.to(user_id).emit("call_receive", `${socket.id}`);
  });

  socket.on("reject", (data: any) => {
    const { user_id } = data;
    io.to(user_id).emit("call_decline", `${socket.id}`);
  });

  socket.on("call_accepted", (data) => {
    const { user_id } = data;
    io.to(user_id).emit("call_accepted", `${socket.id}`);
  });

  socket.on("mesh:createOrJoinRoom", (event) => {
    let myRoom: any = io.sockets.adapter.rooms.get(event?.room);
    console.log("io.sockets.adapter.rooms", io.sockets.adapter.rooms);
    
    if (!myRoom) {
      io.sockets.adapter.rooms.set(event.room, new Set<any>().add(socket?.id))
      socket.join(event.room);
      console.log("create myRoom", myRoom);
      socket.emit("mesh:created", event.room);
    } else if (myRoom) {
      io.sockets.adapter.rooms.set(event.room, myRoom.add(socket?.id))
      socket.join(event.room);
      console.log("join myRoom", myRoom);
      socket.emit("mesh:joined", event.room);
    }
  })

  socket.on("mesh:ready", (room) => {
    console.log("ready to join",room);
    socket.broadcast.to(room).emit("mesh:ready")
  })
  socket.on("mesh:candidate", (event) => {
    socket.broadcast.to(event.room).emit("mesh:candidate", event)
  })
  socket.on("mesh:offer", (event) => {
    console.log("Offer -->", event)
    socket.broadcast.to(event.room).emit("mesh:offer", event.sdp)
  })
  socket.on("mesh:answer", (event) => {
    console.log("answer", event)
    socket.broadcast.to(event.room).emit("mesh:answer", event.sdp)
  })


});
