import React from "react";
import { Menu, X, ScanEye } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-slate-200"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ScanEye size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Animal Detector</h1>
              <p className="text-blue-100 text-xs">AI-Powered Detection</p>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <nav className="p-4 space-y-3">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-semibold text-sm mb-3">How it works</h3>
            <ul className="space-y-2 text-sm text-blue-50">
              <li className="flex gap-2">
                <span className="text-blue-300">1.</span>
                <span>Upload an image with animals</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-300">2.</span>
                <span>AI analyzes the image</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-300">3.</span>
                <span>View results & labels</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-semibold text-sm mb-2">Supported</h3>
            <p className="text-blue-50 text-xs leading-relaxed">
              Detects multiple animals in single image with bounding boxes and confidence scores.
            </p>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-500/30 bg-blue-700/50 backdrop-blur-sm">
          <p className="text-xs text-blue-100 text-center">
            Powered by Gemini AI
          </p>
        </div>
      </aside>

      {/* Main Content Spacer for Desktop */}
      <div className="hidden lg:block w-64"></div>
    </>
  );
}
