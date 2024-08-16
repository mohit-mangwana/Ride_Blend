import "dotenv/config"; // This automatically configures dotenv
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { UserRouter } from "./routes/User.js";
import { TripRoute } from "./routes/TripRoute.js";
import { BookingRouter } from "./routes/Booking Route.js";
import { AdminRouter } from "./routes/AdminRoutes.js";
import { LocationRouter } from "./routes/LocationRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";
import notificationRouter from "./routes/Notificaiton.js";
import Message from "./models/MessageSchema.js";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({ origin: [process.env.REACT_APP_API_BASE_URL], credentials: true })
);
app.use(cookieParser());

app.use("/auth", UserRouter);
app.use("/ride", TripRoute);
app.use("/bookride", BookingRouter);
app.use("/admin", AdminRouter);
app.use("/geocode", LocationRouter);
app.use("/message", messageRouter);
app.use("/notification", notificationRouter);
app.use("/api", chatRoutes);

const port = process.env.PORT || 5000;
const dbConnectionString =
  process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/";
const secretKey = process.env.JWT_SECRET || "your-default-secret-key";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_API_BASE_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ rideId }) => {
    socket.join(rideId);
    console.log(`User ${socket.id} joined room ${rideId}`);
  });

  socket.on("chatMessage", async ({ rideId, sender, recipient, content }) => {
    const message = new Message({ rideId, sender, recipient, content });
    const savedMessage = await message.save();

    io.to(rideId).emit("message", savedMessage);

    // Send notification to the recipient
    io.to(recipient).emit("notification", {
      message: "New Chat Message",
      type: "chat",
      time: new Date().toISOString(),
      redirect: `/ride/${rideId}/chat`,
      sender,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

console.log("DB Connection String:", dbConnectionString);

mongoose
  .connect(dbConnectionString)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log("MongoDB Not connected: " + err.message);
  });

server.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
