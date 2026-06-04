"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import ThreeViewer from "@/components/ThreeViewer";
import ModelViewerPanel from "@/components/ModelViewerPanel";

function MobileViewContent() {
  const searchParams = useSearchParams();
  const image = searchParams.get("image") || "";
  const style = searchParams.get("style") || "packaging";
  const name = searchParams.get("name") || "Product Asset";

  const [activeTab, setActiveTab] = useState<"canvas" | "ar">("canvas");

  if (!image) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
        <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold">Invalid QR Code</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-xs">
          This link does not contain a product image path. Please generate a new QR code from your desktop studio dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Header */}
      <header className="px-5 py-4 border-b border-slate-900 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm border border-indigo-500">
            A3
          </span>
          <span className="font-bold text-sm tracking-tight">
            Aether3D <span className="text-indigo-400">Mobile</span>
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold truncate max-w-[120px]">
          {name}
        </span>
      </header>

      {/* Tabs */}
      <div className="px-4 py-3 flex border-b border-slate-900/60 bg-slate-950/20 justify-center">
        <div className="flex w-full bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setActiveTab("canvas")}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "canvas"
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
            id="mobile-tab-three-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            3D Simulation
          </button>
          
          <button
            onClick={() => setActiveTab("ar")}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "ar"
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
            id="mobile-tab-ar-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-emerald-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            WebAR Camera
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-grow p-4 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {activeTab === "canvas" ? (
            <div className="space-y-4">
              <ThreeViewer
                imageSrc={image}
                style={style}
                autoRotate={true}
                bgColor="studio"
                rotationSpeed={1.5}
                showGrid={false}
              />
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 text-[11px] text-slate-500 text-center">
                Drag on the screen to rotate label mockup. Pinch to zoom in/out.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ModelViewerPanel imageSrc={image} style={style} />
              <div className="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-[11px] text-emerald-400/90 text-center">
                💡 Tap the <strong className="font-semibold text-white">AR badge</strong> in the viewport to launch camera view and project the model in your space.
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-4 border-t border-slate-900/60 bg-slate-950 text-center text-[10px] text-slate-500">
        Aether3D Studio Mobile • Connected over Local Wi-Fi
      </footer>

    </div>
  );
}

export default function MobileView() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-slate-400">Initializing Mobile Studio...</p>
        </div>
      }
    >
      <MobileViewContent />
    </Suspense>
  );
}
