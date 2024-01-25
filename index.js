import express from "express";
import * as dotenv from "dotenv";
import connectDB from "./Config/db.js";
import { Server } from "socket.io";
import { authRouter } from "./routes/auth.js";
import { chatRouter } from "./routes/chat.js";
import { messageRouter } from "./routes/message.js";

// envrionment config
dotenv.config();

// intialzing the server
const app = express();
const PORT = process.env.PORT;

// database connection
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home page
app.get("/", function (request, response) {
  response.send("<h1>app is working<h1>").status(200);
});
// app.listen(PORT, () => {
//   console.log("app is working");
// });

//routes
app.use("/api", authRouter);
app.use("/api", chatRouter);
app.use("/api",messageRouter)

const io = new Server(
  app.listen(PORT, () => console.log("server is connected 7002")),
  {
    pingTimeout: 600000,
    cors: {
      origin: "http://localhost:7002",
    },
  }
);
io.on("connection", (socket) => {
  console.log("connected in socket.io");
  socket.io("setup", () => {
    socket.json(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("join room" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.not found");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id)
        return socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});
