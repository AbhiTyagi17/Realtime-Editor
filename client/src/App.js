import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./styles/App.css";

import Sidebar from "./components/Sidebar";
import JoinRoom from "./components/JoinRoom";
import EditorPage from "./components/EditorPage";

const socket = io("http://localhost:5000");

function App() {
  const [code, setCode] = useState("// Start coding...");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const runCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error(error);
      setOutput("Error running code");
    }
    setLoading(false);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      alert("Enter all fields");
      return;
    }

    socket.emit("join-room", { roomId, username });
    setJoined(true);
  };

  const handleChange = (value) => {
    if (!joined || value === undefined) return;

    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  return (
    <div className="container">

      {joined && <Sidebar roomId={roomId} users={users} />}

      <div className="main">
        {!joined ? (
          <JoinRoom
            username={username}
            setUsername={setUsername}
            roomId={roomId}
            setRoomId={setRoomId}
            joinRoom={joinRoom}
          />
        ) : (
          <EditorPage
            code={code}
            handleChange={handleChange}
            runCode={runCode}
            output={output}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default App;