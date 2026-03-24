import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import InputNode from "./components/InputNode";
import ResultNode from "./components/ResultNode";

const nodeTypes = { inputNode: InputNode, resultNode: ResultNode };
const API_BASE = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mobileView, setMobileView] = useState("flow"); // "flow" | "chat"

  const initialNodes = [
    {
      id: "1",
      type: "inputNode",
      position: { x: 60, y: 180 },
      data: { value: prompt, onChange: setPrompt },
    },
    {
      id: "2",
      type: "resultNode",
      position: { x: 480, y: 150 },
      data: { value: response, loading: false },
    },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((p) => setEdges((eds) => addEdge(p, eds)), []);

  const runFlow = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setSaveStatus("");
    try {
      const res = await fetch(`${API_BASE}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const answer = data.answer || data.error || "Something went wrong";
      setResponse(answer);
      if (mobileView === "chat") setMobileView("chat");
    } catch {
      setResponse("❌ Network error – is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = async () => {
    if (!prompt || !response) return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`${API_BASE}/api/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, response }),
      });
      const data = await res.json();
      setSaveStatus(data.success ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/history`);
      const data = await res.json();
      setHistory(data);
      setShowHistory(true);
    } catch {
      setHistory([]);
    }
  };

  const clearAll = () => {
    setPrompt("");
    setResponse("");
    setSaveStatus("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-200 overflow-hidden">

      {/* ── Navbar ── */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#161b2e] border-b border-slate-700 z-10 shrink-0">
        <span className="text-indigo-400 font-bold text-base md:text-lg tracking-wide">
          ⚡ MERN AI Flow
        </span>

        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3">
          <button
            onClick={runFlow}
            disabled={loading || !prompt.trim()}
            className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Running…" : "▶ Run Flow"}
          </button>
          <button
            onClick={saveConversation}
            disabled={!response || saveStatus === "saving"}
            className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
          >
            {saveStatus === "saving" ? "Saving…"
              : saveStatus === "saved" ? "✅ Saved!"
              : saveStatus === "error" ? "❌ Error"
              : "💾 Save"}
          </button>
          <button
            onClick={loadHistory}
            className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white bg-violet-800 hover:bg-violet-700 transition-colors"
          >
            📋 History
          </button>
          <button
            onClick={clearAll}
            className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white bg-rose-700 hover:bg-rose-600 transition-colors"
          >
            🗑 Clear
          </button>
        </div>

        {/* Mobile buttons */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={runFlow}
            disabled={loading || !prompt.trim()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "…" : "▶ Run"}
          </button>
          <button
            onClick={saveConversation}
            disabled={!response || saveStatus === "saving"}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
          >
            {saveStatus === "saved" ? "✅" : "💾"}
          </button>
          <button
            onClick={loadHistory}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-violet-800 transition-colors"
          >
            📋
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-700 transition-colors"
          >
            🗑
          </button>
        </div>
      </header>

      {/* ── Mobile Tab Toggle ── */}
      <div className="flex sm:hidden border-b border-slate-700 bg-[#161b2e] shrink-0">
        <button
          onClick={() => setMobileView("flow")}
          className={`flex-1 py-2 text-xs font-semibold transition-colors ${
            mobileView === "flow"
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-slate-500"
          }`}
        >
          🔗 Flow View
        </button>
        <button
          onClick={() => setMobileView("chat")}
          className={`flex-1 py-2 text-xs font-semibold transition-colors ${
            mobileView === "chat"
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-slate-500"
          }`}
        >
          💬 Chat View
        </button>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* React Flow — hidden on mobile when chat tab active */}
        <div className={`absolute inset-0 ${mobileView === "chat" ? "hidden sm:block" : "block"}`}>
          <ReactFlow
            nodes={nodes.map((n) => ({
              ...n,
              data:
                n.id === "1"
                  ? { value: prompt, onChange: setPrompt }
                  : { value: response, loading },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#1a1f2e" gap={20} />
            <Controls className="text-slate-800" />
            <MiniMap
              nodeColor={(n) => (n.type === "inputNode" ? "#6366f1" : "#10b981")}
              className="hidden! md:block! bg-[#1a1f2e]/80 border border-slate-700 rounded-lg shadow-lg"
            />
          </ReactFlow>
        </div>

        {/* Mobile Chat View */}
        <div className={`absolute inset-0 flex flex-col gap-3 p-4 overflow-y-auto sm:hidden ${mobileView === "chat" ? "block" : "hidden"}`}>
          {/* Prompt box */}
          <div className="bg-[#1e2130] border-2 border-indigo-600 rounded-xl p-4 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
              ✏️ Prompt
            </div>
            <textarea
              rows={4}
              placeholder="Ask anything…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#0f1117] border border-slate-700 rounded-lg text-slate-200 text-sm px-3 py-2 resize-none outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Response box */}
          <div className="bg-[#1e2130] border-2 border-emerald-500 rounded-xl p-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              🤖 AI Response
            </div>
            <div className={`text-sm leading-relaxed min-h-20 whitespace-pre-wrap wrap-break-word ${
              loading || !response ? "text-slate-600" : "text-slate-200"
            }`}>
              {loading ? "⏳ Thinking…" : response || "Response will appear here…"}
            </div>
          </div>
        </div>

        {/* ── History Panel ── */}
        {showHistory && (
          <div className="absolute top-3 right-3 w-[calc(100%-24px)] sm:w-80 max-h-[75vh] overflow-y-auto bg-[#1a1f2e] border border-slate-700 rounded-xl p-4 z-20 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-indigo-400 font-semibold text-sm">Saved History</span>
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-500 hover:text-slate-300 text-xl leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-slate-600 text-sm">No saved conversations yet.</p>
            ) : (
              history.map((h) => (
                <div key={h._id} className="bg-[#0f1117] border border-[#1e2130] rounded-lg p-3 mb-3">
                  <div className="text-indigo-400 text-xs mb-1">
                    🗓 {new Date(h.createdAt).toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-xs mb-1">
                    <span className="font-semibold">Q:</span> {h.prompt}
                  </div>
                  <div className="text-emerald-400 text-xs">
                    <span className="font-semibold">A:</span>{" "}
                    {h.response.slice(0, 120)}{h.response.length > 120 ? "…" : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}