import React, { useState, useRef } from "react";
import { ScanEye } from "lucide-react";

// Components
import Sidebar from "./components/Sidebar";
import ImageUploadSection from "./components/ImageUploadSection";
import ImagePreviewSection from "./components/ImagePreviewSection";
import ImageActionButtons from "./components/ImageActionButtons";
import DetectionResultsSection from "./components/DetectionResultsSection";

// Hooks
import { useImageProcessing } from "./hooks/useImageProcessing";
import { useCanvasDrawing } from "./hooks/useCanvasDrawing";

// Utils
import { downloadLabeledImage } from "./utils/imageDownload";

export default function App() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canvasRef = useRef(null);

  // Custom hooks
  const { loading, error, setError, processFile, analyzeImage } =
    useImageProcessing();

  // Use canvas drawing hook
  useCanvasDrawing(result, canvasRef, image);

  // --- Event Handlers ---

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file, setImage, setPreviewUrl, setResult);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], setImage, setPreviewUrl, setResult);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    await analyzeImage(image, setResult);
  };

  const handleDownload = () => {
    downloadLabeledImage(canvasRef);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{ backgroundColor: "#f8fafc" }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 w-full lg:ml-0">
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <header className="text-center space-y-2 sm:space-y-3">
              <div
                className="inline-flex items-center justify-center p-3 rounded-full mb-3 sm:mb-4 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                }}
              >
                <ScanEye size={28} className="text-white" />
              </div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{
                  background: "linear-gradient(to right, #2563eb, #4f46e5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Multi-Animal Detector
              </h1>
              <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
                Upload an image with one or many animals. The AI will detect,
                list, and label all of them.
              </p>
            </header>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column: Upload & Preview */}
              <div className="space-y-4 sm:space-y-6">
                {!image ? (
                  <ImageUploadSection
                    onImageUpload={handleImageUpload}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ) : (
                  <div className="space-y-4">
                    <ImagePreviewSection
                      result={result}
                      previewUrl={previewUrl}
                      canvasRef={canvasRef}
                      loading={loading}
                    />

                    {/* Action Buttons */}
                    <ImageActionButtons
                      result={result}
                      loading={loading}
                      onAnalyze={handleAnalyze}
                      onReset={handleReset}
                      onDownload={handleDownload}
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Analysis Results */}
              <div className="space-y-4 sm:space-y-6">
                <DetectionResultsSection
                  result={result}
                  error={error}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{ backgroundColor: "#f8fafc" }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 w-full lg:ml-0">
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <header className="text-center space-y-2 sm:space-y-3">
              <div
                className="inline-flex items-center justify-center p-3 rounded-full mb-3 sm:mb-4 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                }}
              >
                <ScanEye size={28} className="text-white" />
              </div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{
                  background: "linear-gradient(to right, #2563eb, #4f46e5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Multi-Animal Detector
              </h1>
              <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
                Upload an image with one or many animals. The AI will detect,
                list, and label all of them.
              </p>
            </header>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column: Upload & Preview */}
              <div className="space-y-4 sm:space-y-6">
                {!image ? (
                  <ImageUploadSection
                    onImageUpload={handleImageUpload}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ) : (
                  <div className="space-y-4">
                    <ImagePreviewSection
                      result={result}
                      previewUrl={previewUrl}
                      canvasRef={canvasRef}
                      loading={loading}
                    />

                    {/* Action Buttons */}
                    <ImageActionButtons
                      result={result}
                      loading={loading}
                      onAnalyze={handleAnalyze}
                      onReset={handleReset}
                      onDownload={handleDownload}
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Analysis Results */}
              <div className="space-y-4 sm:space-y-6">
                <DetectionResultsSection
                  result={result}
                  error={error}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
