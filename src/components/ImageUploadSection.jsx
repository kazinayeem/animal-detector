import React from "react";
import { Upload } from "lucide-react";

export default function ImageUploadSection({
  onImageUpload,
  onDragOver,
  onDrop,
}) {
  return (
    <div
      className="border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[300px] sm:min-h-[400px]"
      style={{
        borderColor: "#cbd5e1",
        backgroundColor: "#f0f9ff",
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3b82f6";
        e.currentTarget.style.backgroundColor = "#e0f2fe";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#cbd5e1";
        e.currentTarget.style.backgroundColor = "#f0f9ff";
      }}
    >
      <div
        className="p-3 sm:p-4 rounded-full mb-4"
        style={{
          backgroundColor: "#dbeafe",
        }}
      >
        <Upload className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: "#2563eb" }} />
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: "#1f2937" }}>
        Upload Image
      </h3>
      <p className="text-xs sm:text-sm mb-6" style={{ color: "#4b5563" }}>
        Drag and drop or click to browse
      </p>
      <label
        className="text-white px-4 sm:px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors shadow-lg"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
        }}
      >
        Select File
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onImageUpload}
        />
      </label>
    </div>
  );
}
