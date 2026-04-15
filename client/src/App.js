import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [code, setCode] = useState("// Start coding...");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-update");
    };
  }, []);

  const joinRoom = () => {
    if (roomId.trim() !== "") {
      socket.emit("join-room", roomId);
      setJoined(true);
    }
  };

  const handleChange = (value) => {
    setCode(value);

    if (joined) {
      socket.emit("code-change", {
        roomId,
        code: value,
      });
    }
  };

  return (
    <div>
      <h1>Real-Time Code Editor</h1>

      {!joined ? (
        <div>
          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <Editor
          height="80vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

export default App;