const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ RUN CODE ROUTE (SAFE VERSION)
app.post("/run", (req, res) => {
  const { code } = req.body;

  // 🔒 Basic validation
  if (!code) {
    return res.json({ output: "No code provided" });
  }

  // 🔥 Unique file per execution
  const filePath = `tempCode_${Date.now()}.js`;

  try {
    // Save code to file
    fs.writeFileSync(filePath, code);

    // Execute with timeout (important)
    exec(`node ${filePath}`, { timeout: 3000 }, (error, stdout, stderr) => {
      
      // 🧹 Cleanup file
      fs.unlinkSync(filePath);

      if (error) {
        return res.json({ output: error.message });
      }

      if (stderr) {
        return res.json({ output: stderr });
      }

      res.json({
        output: stdout || "No output",
      });
    });

  } catch (err) {
    console.error("Execution error:", err);
    res.status(500).json({ output: "Server error while running code" });
  }
});

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store users per room
const users = {}; // { roomId: [ {id, username} ] }

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!users[roomId]) users[roomId] = [];
    users[roomId].push({ id: socket.id, username });

    io.to(roomId).emit("users-update", users[roomId]);

    console.log(`${username} joined ${roomId}`);
  });

  // Code change sync
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);
  });

  // Disconnect
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

// ✅ Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});