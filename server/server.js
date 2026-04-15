const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Socket connection
const users = {}; // { roomId: [user1, user2] }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    // Add user
    if (!users[roomId]) users[roomId] = [];
    users[roomId].push({ id: socket.id, username });

    // Send updated users list
    io.to(roomId).emit("users-update", users[roomId]);

    console.log(`${username} joined ${roomId}`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);
  });

  socket.on("disconnect", () => {
    for (let roomId in users) {
      users[roomId] = users[roomId].filter(
        (user) => user.id !== socket.id
      );

      io.to(roomId).emit("users-update", users[roomId]);
    }

    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});