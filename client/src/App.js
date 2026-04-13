import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("// Start coding...");

  return (
    <div>
      <h1>Real-Time Code Editor</h1>

      <Editor
        height="80vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />
    </div>
  );
}

export default App;