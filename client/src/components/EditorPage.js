import Editor from "@monaco-editor/react";

function EditorPage({ code, handleChange }) {
  return (
    <>
      <div className="topbar">
        <button onClick={() => navigator.clipboard.writeText(code)}>
          Copy Code
        </button>

        <button onClick={() => {
          const blob = new Blob([code], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "code.js";
          a.click();
        }}>
          Download Code
        </button>
      </div>

      <Editor
        height="90vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleChange}
      />
    </>
  );
}

export default EditorPage;