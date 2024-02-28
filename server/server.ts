import http from "http";
import express, { Request, Response } from "express";
import { Server as SocketServer } from "socket.io";
import cors from "cors";

const app = express();
const PORT = 4500;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log("Listening on port %s", PORT);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello manoj");
});

export const io = new SocketServer(httpServer, {
  cors:{
    origin: "*",
  }
});

import "./socket/socket";
