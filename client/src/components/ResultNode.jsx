import { Handle, Position } from "@xyflow/react";

export default function ResultNode({ data }) {
  const isEmpty = !data.value;
  const isLoading = data.loading;

  return (
    <div className="bg-[#1e2130] border-2 border-emerald-500 rounded-xl p-4 w-72 sm:w-80 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3! h-3! bg-emerald-500!"
      />
      <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
        🤖 AI Response
      </div>
      <div
        className={`text-sm leading-relaxed min-h-20 max-h-52 sm:max-h-60 overflow-y-auto whitespace-pre-wrap wrap-break-word
          ${isLoading || isEmpty ? "text-slate-600" : "text-slate-200"}`}
      >
        {isLoading
          ? "⏳ Thinking…"
          : isEmpty
          ? "Response will appear here…"
          : data.value}
      </div>
    </div>
  );
}