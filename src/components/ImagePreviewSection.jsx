import React from "react";

export default function ImagePreviewSection({ result, previewUrl, canvasRef, loading }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl border"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
      }}
    >
      {/* Show Canvas if result exists (for the label), otherwise show raw image */}
      {result ? (
        <canvas
          ref={canvasRef}
          className="w-full h-auto block object-contain max-h-[400px] sm:max-h-[600px]"
        />
      ) : (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-auto object-contain max-h-[400px] sm:max-h-[600px]"
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div
          className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center z-10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <div
            className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-transparent mb-4"
            style={{
              borderColor: "#3b82f6",
              borderTopColor: "transparent",
            }}
          ></div>
          <p
            className="font-medium animate-pulse text-sm sm:text-base"
            style={{ color: "#1d4ed8" }}
          >
            Scanning for animals...
          </p>
        </div>
      )}
    </div>
  );
}
