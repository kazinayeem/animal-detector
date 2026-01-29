import { Zap, RotateCcw, Download } from "lucide-react";

export default function ImageActionButtons({
  result,
  loading,
  onAnalyze,
  onReset,
  onDownload,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {!result ? (
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <Zap size={20} />
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>
      ) : (
        <>
          <button
            onClick={onDownload}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-600 hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            <Download size={20} />
            Download Result
          </button>
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300 active:scale-95"
          >
            <RotateCcw size={20} />
            Upload New
          </button>
        </>
      )}
    </div>
  );
}
