import React, { useState, useRef } from "react";
import { Upload, Check } from "lucide-react";

// Components
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
  const canvasRef = useRef(null);

  const { loading, error, setError, processFile, analyzeImage } = useImageProcessing();
  useCanvasDrawing(result, canvasRef, image);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="sticky top-0 backdrop-blur-sm bg-white/50 border-b border-blue-100/50 z-50">
          <div className="max-w-6xl mx-auto px-6 py-6 sm:py-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Multi-Animal Detector
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                AI-Powered Image Analysis using Gemini AI
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 sm:py-12">
          {!image ? (
            <div className="space-y-8">
              <div className="space-y-6">
                <ImageUploadSection
                  onImageUpload={handleImageUpload}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100/50 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Image Preview</h2>
                    <ImagePreviewSection
                      result={result}
                      previewUrl={previewUrl}
                      canvasRef={canvasRef}
                      loading={loading}
                    />
                  </div>
                </div>

                <div>
                  <ImageActionButtons
                    result={result}
                    loading={loading}
                    onAnalyze={handleAnalyze}
                    onReset={handleReset}
                    onDownload={handleDownload}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100/50 overflow-hidden hover:shadow-md transition-shadow sticky top-24">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Detection Results</h2>
                    <DetectionResultsSection
                      result={result}
                      error={error}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-blue-100/50 backdrop-blur-sm bg-white/30 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600 text-sm">
            <p>Multi-Animal Detector • Powered by Gemini AI • Detect and analyze wildlife in your images</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
