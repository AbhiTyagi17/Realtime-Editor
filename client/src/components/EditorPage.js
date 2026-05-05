import Editor from "@monaco-editor/react";

function EditorPage({ code, handleChange, runCode, output }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* 🔝 Top Bar */}
      <div
        className="topbar"
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          background: "#1e1e1e",
        }}
      >
        <button onClick={() => navigator.clipboard.writeText(code)}>
          Copy Code
        </button>

        <button
          onClick={() => {
            console.log("Run clicked 🔥");
            runCode();
          }}
        >
          ▶ Run Code
        </button>

        <button
          onClick={() => {
            const blob = new Blob([code], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "code.js";
            a.click();
          }}
        >
          Download Code
        </button>
      </div>

      {/* 🧠 Editor + Output */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* 📝 Editor */}
        <div style={{ flex: 1, height: "100%" }}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleChange}
            options={{
              automaticLayout: true,
              minimap: { enabled: false }
            }}
          />
        </div>

        {/* 🖥 Output Panel */}
        <div
          style={{
            width: "35%",
            background: "#000",
            color: "#0f0",
            padding: "10px",
            overflow: "auto",
            borderLeft: "2px solid #333",
          }}
        >
          <h4>Output</h4>
          <pre>{output || "Run code to see output..."}</pre>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;