import { Upload, Cloud } from "lucide-react";

export default function ImageUploadSection({
  onImageUpload,
  onDragOver,
  onDrop,
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative bg-white rounded-2xl border-2 border-dashed border-blue-300 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer group p-8 sm:p-16"
    >
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Upload Image
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Drag and drop your image here, or click the button below to select
          </p>
          <p className="text-gray-500 text-xs sm:text-sm pt-2">
            Supported formats: JPG, PNG, WEBP (Max 10MB)
          </p>
        </div>

        <label className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95">
            <Cloud className="w-5 h-5" />
            Select Image
          </button>
        </label>
      </div>
    </div>
  );
}
