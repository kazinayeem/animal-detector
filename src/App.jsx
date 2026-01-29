import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ScanEye,
  Download,
  PawPrint,
} from "lucide-react";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // --- Image Handling ---

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Base64 string
      setPreviewUrl(reader.result);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const resetApp = () => {
    setImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  // --- API Interaction ---

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      // Extract base64 data (remove "data:image/jpeg;base64," prefix)
      const base64Data = image.split(",")[1];
      const mimeType = image.split(";")[0].split(":")[1];

      // Updated prompt to request multiple animals and bounding boxes
      const prompt = `
        Analyze the uploaded image carefully. Detect ALL distinct animals present.
        For each animal, identify the species and estimate its location (bounding box).

        Return a strictly valid JSON object with this structure:
        {
          "animals": [
            {
              "name": "string (Common Name)",
              "confidence": number (0-100),
              "description": "string (Very short visual note, max 10 words)",
              "box_2d": [ymin, xmin, ymax, xmax] 
            }
          ]
        }
        
        Important Rules:
        - "box_2d" values must be integers from 0 to 1000 (normalized coordinates).
        - [ymin, xmin, ymax, xmax] means: top, left, bottom, right.
        - If no animals are found, return "animals": [].
        - If multiple animals are close, try to distinguish them.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0].content) {
        throw new Error("No analysis data received.");
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      const parsedResult = JSON.parse(textResponse);

      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Canvas Drawing (Image Labeling) ---

  useEffect(() => {
    if (result && canvasRef.current && image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Set canvas to match image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        if (result.animals && result.animals.length > 0) {
          result.animals.forEach((animal, index) => {
            // Default color cycle for multiple animals
            const colors = [
              "#22c55e",
              "#3b82f6",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
              "#ec4899",
            ];
            const color = colors[index % colors.length];

            // Check if bounding box exists and is valid
            if (animal.box_2d && animal.box_2d.length === 4) {
              const [ymin, xmin, ymax, xmax] = animal.box_2d;

              // Convert normalized (0-1000) coords to pixels
              const x = (xmin / 1000) * img.width;
              const y = (ymin / 1000) * img.height;
              const w = ((xmax - xmin) / 1000) * img.width;
              const h = ((ymax - ymin) / 1000) * img.height;

              // Draw Bounding Box
              ctx.strokeStyle = color;
              ctx.lineWidth = Math.max(3, Math.floor(img.width / 200));
              ctx.strokeRect(x, y, w, h);

              // Draw Label Background
              const text = animal.name.toUpperCase();
              const fontSize = Math.max(16, Math.floor(img.width / 40));
              ctx.font = `bold ${fontSize}px sans-serif`;
              const textMetrics = ctx.measureText(text);
              const padding = fontSize / 3;
              const textWidth = textMetrics.width + padding * 2;
              const textHeight = fontSize + padding * 2;

              // Ensure label stays within image bounds (roughly)
              let labelY = y - textHeight;
              if (labelY < 0) labelY = y; // If too high, put it inside/below top edge

              ctx.fillStyle = color;
              ctx.fillRect(x, labelY, textWidth, textHeight);

              // Draw Text
              ctx.fillStyle = "#FFFFFF";
              ctx.textBaseline = "top";
              ctx.fillText(text, x + padding, labelY + padding);
            } else {
              // Fallback if no box: List names at bottom left
              const text = animal.name.toUpperCase();
              const fontSize = Math.max(20, Math.floor(img.width / 30));
              ctx.font = `bold ${fontSize}px sans-serif`;
              ctx.fillStyle = "#FFFFFF";
              ctx.strokeStyle = "black";
              ctx.lineWidth = 3;
              ctx.strokeText(
                text,
                20,
                img.height - 20 - index * fontSize * 1.2,
              );
              ctx.fillText(text, 20, img.height - 20 - index * fontSize * 1.2);
            }
          });
        }
      };

      img.src = image;
    }
  }, [result, image]);

  const downloadLabeledImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `detected-animals.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-full mb-4 shadow-lg shadow-indigo-900/50">
            <ScanEye size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Multi-Animal Detector
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Upload an image with one or many animals. The AI will detect, list,
            and label all of them.
          </p>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Upload & Preview */}
          <div className="space-y-6">
            {!image ? (
              <div
                className="border-2 border-dashed border-slate-600 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-indigo-400 hover:bg-slate-800/50 transition-all cursor-pointer group h-96"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="bg-slate-800 p-4 rounded-full mb-4 group-hover:bg-indigo-600/20 transition-colors">
                  <Upload className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Upload Image
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Drag and drop or click to browse
                </p>
                <label className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors shadow-lg shadow-indigo-900/20">
                  Select File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-700">
                  {/* Show Canvas if result exists (for the label), otherwise show raw image */}
                  {result ? (
                    <canvas
                      ref={canvasRef}
                      className="w-full h-auto block object-contain max-h-[600px]"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto object-contain max-h-[600px]"
                    />
                  )}

                  {/* Loading Overlay */}
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                      <p className="text-indigo-200 font-medium animate-pulse">
                        Scanning for animals...
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!result && !loading && (
                    <button
                      onClick={analyzeImage}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2"
                    >
                      <Camera size={20} />
                      Detect Animals
                    </button>
                  )}

                  <button
                    onClick={resetApp}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors border border-slate-600"
                    title="Reset"
                  >
                    <RefreshCw size={20} />
                  </button>

                  {result && (
                    <button
                      onClick={downloadLabeledImage}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      Save Result
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Analysis Results */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 min-h-[300px] flex flex-col h-full max-h-[700px]">
              <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2 shrink-0">
                <CheckCircle2 className="text-indigo-400" />
                Detection Results
                {result?.animals && (
                  <span className="ml-auto bg-indigo-500/20 text-indigo-300 text-sm py-1 px-3 rounded-full">
                    Count: {result.animals.length}
                  </span>
                )}
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-200">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {!result && !loading && !error && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-60">
                  <PawPrint size={48} />
                  <p>Ready to analyze</p>
                </div>
              )}

              {result && (
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {result.animals && result.animals.length > 0 ? (
                    result.animals.map((animal, idx) => {
                      const colors = [
                        "border-green-500",
                        "border-blue-500",
                        "border-amber-500",
                        "border-red-500",
                        "border-purple-500",
                        "border-pink-500",
                      ];
                      const borderColor = colors[idx % colors.length];

                      return (
                        <div
                          key={idx}
                          className={`bg-slate-900/80 p-4 rounded-xl border-l-4 ${borderColor} shadow-sm animate-in fade-in slide-in-from-right-4 duration-500`}
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-white">
                              {animal.name}
                            </h3>
                            <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded text-xs font-mono text-indigo-300">
                              <span>{animal.confidence}%</span>
                            </div>
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {animal.description}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 text-center">
                      <p className="text-slate-400">
                        No animals were confidently detected in this image.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-center text-slate-600 shrink-0">
              AI Identification may not be 100% accurate. Powered by Gemini
              Vision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
