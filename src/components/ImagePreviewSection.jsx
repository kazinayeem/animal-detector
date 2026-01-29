import { CheckCircle2 } from "lucide-react";

export default function ImagePreviewSection({
  result,
  previewUrl,
  canvasRef,
  loading,
}) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
      <div className="relative w-full">
        {result && result.animals && result.animals.length > 0 ? (
          <canvas
            ref={canvasRef}
            className="w-full h-auto display-block max-h-[500px] object-cover"
          />
        ) : (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto display-block max-h-[500px] object-cover"
          />
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-3 border-white/30"></div>
                <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-white animate-spin"></div>
              </div>
              <p className="text-white font-semibold text-sm">Analyzing image...</p>
            </div>
          </div>
        )}

        {!loading && result && result.animals && result.animals.length > 0 && (
          <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
            <CheckCircle2 size={16} />
            {result.animals.length} {result.animals.length === 1 ? "animal" : "animals"} detected
          </div>
        )}
      </div>
    </div>
  );
}
