import React from "react";
import { Camera, RefreshCw, Download } from "lucide-react";

export default function ImageActionButtons({
  result,
  loading,
  onAnalyze,
  onReset,
  onDownload,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {!result && !loading && (
        <button
          onClick={onAnalyze}
          className="flex-1 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
          }}
        >
          <Camera size={18} />
          Detect Animals
        </button>
      )}

      <button
        onClick={onReset}
        className="px-4 py-3 text-slate-900 rounded-xl font-medium transition-colors border flex items-center justify-center gap-2"
        style={{
          backgroundColor: "#e2e8f0",
          borderColor: "#cbd5e1",
          color: "#1f2937",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#cbd5e1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#e2e8f0";
        }}
      >
        <RefreshCw size={18} />
        <span className="hidden sm:inline">Reset</span>
      </button>

      {result && (
        <button
          onClick={onDownload}
          className="flex-1 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #059669 0%, #047857 100%)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
          }}
        >
          <Download size={18} />
          Save Result
        </button>
      )}
    </div>
  );
}
