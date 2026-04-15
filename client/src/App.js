import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [code, setCode] = useState("// Start coding...");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    socket.on("users-update", (usersList) => {
      setUsers(usersList);
    });

    return () => {
      socket.off("code-update");
      socket.off("users-update");
    };
  }, []);

  const joinRoom = () => {
    if (roomId && username) {
      socket.emit("join-room", { roomId, username });
      setJoined(true);
    }
  };

  const handleChange = (value) => {
    setCode(value);

    socket.emit("code-change", {
      roomId,
      code: value,
    });
  };

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{ width: "200px", padding: "10px", background: "#1e1e1e", color: "white" }}>
        <h3>Users</h3>
        {users.map((user) => (
          <div key={user.id}>🟢 {user.username}</div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1 }}>
        <h1>Real-Time Code Editor</h1>

        {!joined ? (
          <div>
            <input
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        ) : (
          <Editor
            height="90vh"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;