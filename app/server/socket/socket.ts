import { io } from "../server";

io.on("connection", (socket) => {
  console.log("Connection started", socket.id);
  socket.emit("message", "hey lavdu");
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
});
