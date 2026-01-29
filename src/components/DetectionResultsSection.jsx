import React from "react";
import { AlertCircle, CheckCircle2, PawPrint } from "lucide-react";

export default function DetectionResultsSection({
  result,
  error,
  loading,
}) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-6 border min-h-[300px] sm:min-h-[400px] flex flex-col h-full max-h-[600px] sm:max-h-[700px] shadow-lg"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
      }}
    >
      <h2
        className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 shrink-0 flex-wrap"
        style={{ color: "#1f2937" }}
      >
        <CheckCircle2 size={20} style={{ color: "#2563eb", flexShrink: 0 }} />
        <span>Detection Results</span>
        {result?.animals && (
          <span
            className="ml-auto text-xs sm:text-sm py-1 px-2 sm:px-3 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: "#dbeafe",
              color: "#1e40af",
            }}
          >
            Count: {result.animals.length}
          </span>
        )}
      </h2>

      {error && (
        <div
          className="rounded-xl p-3 sm:p-4 flex items-start gap-3 text-xs sm:text-sm mb-4 border"
          style={{
            backgroundColor: "#fee2e2",
            borderColor: "#fecaca",
            color: "#991b1b",
          }}
        >
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <p>{error}</p>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 opacity-60">
          <PawPrint size={40} style={{ color: "#9ca3af" }} />
          <p className="text-sm sm:text-base" style={{ color: "#6b7280" }}>
            Ready to analyze
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-3 sm:space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {result.animals && result.animals.length > 0 ? (
            result.animals.map((animal, idx) => {
              const colors = [
                { border: "#22c55e", bg: "#f0fdf4" },
                { border: "#3b82f6", bg: "#f0f9ff" },
                { border: "#f59e0b", bg: "#fffbeb" },
                { border: "#ef4444", bg: "#fef2f2" },
                { border: "#8b5cf6", bg: "#faf5ff" },
                { border: "#ec4899", bg: "#fdf2f8" },
              ];
              const color = colors[idx % colors.length];

              return (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-xl border-l-4 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500"
                  style={{
                    borderLeftColor: color.border,
                    backgroundColor: color.bg,
                    animationDelay: `${idx * 100}ms`,
                  }}
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3
                      className="font-bold text-base sm:text-lg break-words"
                      style={{ color: "#1f2937" }}
                    >
                      {animal.name}
                    </h3>
                    <div
                      className="flex items-center gap-2 px-2 py-1 rounded text-xs font-mono shrink-0"
                      style={{
                        backgroundColor: "#dbeafe",
                        color: "#1e40af",
                      }}
                    >
                      <span>{animal.confidence}%</span>
                    </div>
                  </div>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: "#4b5563" }}
                  >
                    {animal.description}
                  </p>
                </div>
              );
            })
          ) : (
            <div
              className="p-4 sm:p-6 rounded-xl border text-center"
              style={{
                backgroundColor: "#f9fafb",
                borderColor: "#e5e7eb",
              }}
            >
              <p style={{ color: "#4b5563" }}>
                No animals were confidently detected in this image.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
