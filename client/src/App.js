import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [code, setCode] = useState("// Start coding...");

  useEffect(() => {
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-update");
    };
  }, []);

  const handleChange = (value) => {
    setCode(value);
    socket.emit("code-change", value);
  };

  return (
    <div>
      <h1>Real-Time Code Editor</h1>

      <Editor
        height="80vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;