import { Handle, Position } from "@xyflow/react";

export default function InputNode({ data }) {
  return (
    <div className="bg-[#1e2130] border-2 border-indigo-600 rounded-xl p-4 w-64 sm:w-72 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
      <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
        ✏️ Prompt
      </div>
      <textarea
        rows={4}
        placeholder="Ask anything…"
        value={data.value}
        onChange={(e) => data.onChange(e.target.value)}
        className="w-full bg-[#0f1117] border border-slate-700 rounded-lg text-slate-200 text-sm px-3 py-2 resize-none outline-none focus:border-indigo-500 transition-colors leading-relaxed font-sans"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3! h-3! bg-indigo-500!"
      />
    </div>
  );
}