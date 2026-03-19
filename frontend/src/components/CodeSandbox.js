import React, { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeSandbox({
  language = "javascript",
  starterCode = "",
  onRun,
  onSubmit,
  containerClass = "",
  outputClass = "",
  height = 420,
}) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");

  const handleRun = async () => {
    if (!onRun) return;
    const result = await onRun(code);
    setOutput(result || "No output");
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    const result = await onSubmit(code);
    setOutput(result || "Submitted");
  };

  return (
    <div className={`flex flex-col bg-[#1e1e1e] rounded-2xl overflow-hidden ${containerClass}`}>
      <div className="flex-1 min-h-[300px]" style={{ maxHeight: height }}>
        <Editor
          height={`${height}px`}
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-3">
        <button
          onClick={handleRun}
          className="px-5 py-2 bg-blue-600 rounded-lg text-white"
        >
          Run
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-green-600 rounded-lg text-white"
        >
          Submit
        </button>
      </div>

      <div className={`p-4 bg-black text-green-400 text-sm h-32 overflow-y-auto ${outputClass}`}>
        {output || "Run code to view output"}
      </div>
    </div>
  );
}