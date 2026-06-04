"use client";

import React, { useEffect, useState } from "react";

interface ModelViewerPanelProps {
  style: "chair" | "decor" | "desk" | "rug" | string;
}

export default function ModelViewerPanel({ style = "chair" }: ModelViewerPanelProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [arEnabled, setArEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Client-side only import of the web component
  useEffect(() => {
    import("@google/model-viewer")
      .then(() => {
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load @google/model-viewer:", err);
      });
  }, []);

  // Determine scaling dimensions
  const getScaleString = () => {
    switch (style) {
      case "rug":
        return "2 0.005 3"; // Flat rug sheet
      case "desk":
        return "2 0.75 1.2"; // Bureau block
      case "decor":
        return "3.5 3.5 3.5"; // Scale up small duck model
      case "chair":
        return "1.6 1.6 1.6"; // Scale chair
      default:
        return "1.5 1.5 1.5";
    }
  };

  if (!loaded) {
    return (
      <div className="w-full h-[500px] rounded-2xl glass-panel flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-slate-400">Loading WebAR Engines...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AR & Model Viewer
            </h2>
            <p className="text-xs text-slate-400">
              Preview final 3D GLB assets in an AR-ready space.
            </p>
          </div>
          
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] uppercase font-mono tracking-widest text-indigo-400">
            Model: {style}
          </div>
        </div>

        {/* Model Viewer Component Frame */}
        <div className="relative w-full h-[380px] rounded-xl overflow-hidden bg-gradient-to-tr from-slate-950 to-indigo-950/20 border border-slate-800/80 flex items-center justify-center">
          <model-viewer
            id="ar-model-viewer"
            src={`/models/${style}.glb`}
            alt="3D Furniture Model Showcase"
            ar={arEnabled}
            ar-modes="webxr scene-viewer quick-look"
            ar-placement={style === "rug" || style === "desk" ? "floor" : "auto"} // Snap rugs and desks directly to the floor!
            camera-controls
            auto-rotate={autoRotate}
            scale={getScaleString()} // Dynamic scaling
            shadow-intensity="1.5"
            shadow-softness="0.8"
            exposure="1.0"
            style={{ width: "100%", height: "100%", outline: "none" }}
          ></model-viewer>

          {/* AR badge helper */}
          {arEnabled && (
            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] uppercase font-mono tracking-widest text-emerald-400 flex items-center gap-1.5 shadow-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                AR Available
              </span>
            </div>
          )}
        </div>

        {/* Settings control panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <span className="text-xs font-semibold text-slate-300">Auto-Rotation</span>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              id="ar-autorotate-toggle"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoRotate ? "bg-indigo-600" : "bg-slate-850"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoRotate ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <span className="text-xs font-semibold text-slate-300">Augmented Reality</span>
            <button
              onClick={() => setArEnabled(!arEnabled)}
              id="ar-toggle"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                arEnabled ? "bg-indigo-600" : "bg-slate-850"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  arEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-900 pt-4 flex flex-col gap-2">
        <p className="text-[10px] text-slate-500 font-mono text-center">
          Interactive WebAR model render. Snapping: {style === "rug" || style === "desk" ? "floor" : "auto"}.
        </p>
      </div>
    </div>
  );
}
