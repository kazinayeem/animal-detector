import { AlertCircle, CheckCircle2, PawPrint } from "lucide-react";

export default function DetectionResultsSection({
  result,
  error,
  loading,
}) {
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <h4 className="font-semibold text-red-900 text-sm">Analysis Error</h4>
        </div>
        <p className="text-red-700 text-xs leading-relaxed">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center space-y-3">
        <div className="relative w-10 h-10 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
        <p className="text-blue-700 text-sm font-semibold">Processing image...</p>
      </div>
    );
  }

  if (!result || !result.animals || result.animals.length === 0) {
    return (
      <div className="p-8 text-center space-y-3">
        <PawPrint size={32} className="mx-auto text-gray-400" />
        <p className="text-gray-600 text-sm font-medium">Ready to analyze</p>
        <p className="text-gray-500 text-xs">Upload an image and click analyze to get started</p>
      </div>
    );
  }

  const colors = [
    { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", bar: "bg-blue-500" },
    { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700", bar: "bg-green-500" },
    { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
    { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-700", bar: "bg-purple-500" },
    { bg: "bg-pink-50", border: "border-pink-200", badge: "bg-pink-100 text-pink-700", bar: "bg-pink-500" },
    { bg: "bg-indigo-50", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700", bar: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {result.animals.map((animal, index) => {
        const colorSet = colors[index % colors.length];
        const confidence = Math.round(animal.confidence * 100);

        return (
          <div
            key={index}
            className={`p-4 border rounded-lg transition-all hover:shadow-md ${colorSet.bg} ${colorSet.border}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-sm text-gray-900 capitalize flex-1">
                {animal.name}
              </h4>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${colorSet.badge}`}>
                {confidence}%
              </div>
            </div>

            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${colorSet.bar}`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>

            {/* Description - Optional if you want to keep it minimal */}
            {animal.description && (
              <p className="text-xs text-gray-600 leading-relaxed mt-2">
                {animal.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
