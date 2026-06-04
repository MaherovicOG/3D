"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ThreeViewer from "@/components/ThreeViewer";
import ModelViewerPanel from "@/components/ModelViewerPanel";

interface PresetProduct {
  id: string;
  name: string;
  style: string;
  description: string;
  icon: string;
  dimensions: string;
}

const PRESET_PRODUCTS: PresetProduct[] = [
  {
    id: "chair",
    name: "Armchair",
    style: "chair",
    description: "Modern ergonomic armchair styled in standard fabric sheen.",
    icon: "🛋️",
    dimensions: "1.6m x 1.6m x 1.6m",
  },
  {
    id: "decor",
    name: "Table Décor",
    style: "decor",
    description: "Lightweight stylized duck figurine desktop decoration.",
    icon: "🦆",
    dimensions: "0.5m x 0.5m x 0.5m",
  },
  {
    id: "desk",
    name: "Bureau / Desk",
    style: "desk",
    description: "Walnut amber solid block office writing desk.",
    icon: "🖥️",
    dimensions: "2.0m x 0.75m x 1.2m",
  },
  {
    id: "rug",
    name: "Rug",
    style: "rug",
    description: "Crimson red flat-woven low-pile floor carpet.",
    icon: "🟥",
    dimensions: "2.0m x 0.005m x 3.0m",
  },
];

export default function Dashboard() {
  const [activeProduct, setActiveProduct] = useState<PresetProduct>(PRESET_PRODUCTS[0]);
  const [activeTab, setActiveTab] = useState<"canvas" | "ar">("canvas");

  // Three.js renderer customization states
  const [bgColor, setBgColor] = useState<"studio" | "light" | "dark" | "transparent">("studio");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.5);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  // QR sharing states
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeImgUrl, setQrCodeImgUrl] = useState("");
  const [mobileShareUrl, setMobileShareUrl] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);

  // Generate QR Code for Phone/Mobile AR view
  const handleShareMobile = async () => {
    setLoadingQr(true);
    setIsQrModalOpen(true);

    try {
      // Fetch host machine local network IP address
      const infoRes = await fetch("/api/info");
      const infoData = await infoRes.json();
      const localIp = infoData.localIp || "localhost";

      // Build target phone link
      const port = window.location.port ? `:${window.location.port}` : "";
      const baseShareUrl = `http://${localIp}${port}/mobile-view?style=${activeProduct.style}&name=${encodeURIComponent(
        activeProduct.name
      )}`;
      
      setMobileShareUrl(baseShareUrl);

      // Construct API endpoint for QR code SVG/PNG
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=4f46e5&bgcolor=020617&data=${encodeURIComponent(
        baseShareUrl
      )}`;
      setQrCodeImgUrl(qrApiUrl);
    } catch (err) {
      console.error("Failed to share product on mobile:", err);
      alert("Failed to build mobile visualization code. Verify server is running.");
      setIsQrModalOpen(false);
    } finally {
      setLoadingQr(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 relative">
      
      {/* 1. Left Sidebar - Preset Furniture Selector */}
      <aside className="w-80 border-r border-slate-900 bg-slate-950/80 flex flex-col justify-between shrink-0">
        <div className="p-6 overflow-y-auto flex-grow flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/" className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/35 border border-indigo-500">
              A3
            </Link>
            <span className="font-bold text-base tracking-tight text-white">
              Aether<span className="text-indigo-400">3D</span> Studio
            </span>
          </div>

          {/* Furniture Preset List */}
          <div className="flex-grow space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Furniture Studio</h3>
              <p className="text-[10px] text-slate-500">Select an object below to inspect and generate its AR phone scan code.</p>
            </div>

            <div className="space-y-2">
              {PRESET_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setActiveProduct(prod)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    activeProduct.id === prod.id
                      ? "bg-slate-900 border-indigo-500/50 shadow-md shadow-indigo-500/5"
                      : "bg-slate-900/30 border-slate-900 hover:border-slate-800 hover:bg-slate-900/60"
                  }`}
                  id={`preset-card-${prod.id}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center text-lg shrink-0">
                    {prod.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200">{prod.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{prod.description}</p>
                    <span className="inline-block text-[9px] font-mono text-indigo-400/80 mt-1">{prod.dimensions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-slate-900 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to landing page
          </Link>
        </div>
      </aside>

      {/* 2. Main content area */}
      <main className="flex-grow flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-900 px-8 flex items-center justify-between bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-200 animate-pulse-slow" id="main-workspace-title">
              {activeProduct.name} Demonstration
            </h1>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 uppercase font-mono">
              3D Object
            </span>
          </div>

          <div className="flex items-center">
            {/* Mobile Share Button */}
            <button
              onClick={handleShareMobile}
              id="mobile-share-btn"
              className="mr-3 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold flex items-center gap-1.5 transition-all text-white shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer animate-pulse"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l.908-.452a2.25 2.25 0 102.247-2.202 2.25 2.25 0 00-2.247 2.202m-.908.452l.908.452m0 0a2.25 2.25 0 102.247 2.202 2.25 2.25 0 00-2.247-2.202" />
              </svg>
              Mobile AR (QR Code)
            </button>

            {/* View Tab Selectors */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setActiveTab("canvas")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "canvas"
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab-threejs-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                Three.js Canvas
              </button>
              <button
                onClick={() => setActiveTab("ar")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "ar"
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab-ar-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                WebAR Showcase
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Panels */}
        <div className="flex-grow p-8 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
            
            {/* Left Column: Visual Viewport (span 2) */}
            <div className="xl:col-span-2 space-y-4">
              {activeTab === "canvas" ? (
                <ThreeViewer
                  style={activeProduct.style}
                  autoRotate={autoRotate}
                  bgColor={bgColor}
                  rotationSpeed={rotationSpeed}
                  showGrid={showGrid}
                />
              ) : (
                <ModelViewerPanel style={activeProduct.style} />
              )}

              {/* Hotkeys and Instructions Helper */}
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 text-xs text-slate-500 space-y-1">
                <span className="font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  Studio Tips
                </span>
                <p>• Left-click + drag to orbit. Right-click + drag to pan.</p>
                <p>• Scroll zoom in/out. Rotation is centered on active model.</p>
                <p>• Tapping "Mobile AR" opens the phone camera link scanner dialog.</p>
              </div>
            </div>

            {/* Right Column: Style & Renderer Settings */}
            <div className="space-y-6">
              
              {/* 1. Simulation Controls Card */}
              <div className="glass-panel p-6 rounded-2xl space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Studio Settings</h3>
                  <p className="text-[11px] text-slate-500">Fine-tune the active 3D viewport parameters.</p>
                </div>

                {/* Viewport Theme background */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400">Environment Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "studio", label: "Studio Gradient" },
                      { id: "dark", label: "Solid Black" },
                      { id: "light", label: "Clean Light" },
                      { id: "transparent", label: "Transparent" },
                    ].map((env) => (
                      <button
                        key={env.id}
                        onClick={() => setBgColor(env.id as any)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          bgColor === env.id
                            ? "bg-slate-900 border-indigo-500/80 text-indigo-300"
                            : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                        }`}
                      >
                        {env.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto Rotate Control */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-900">
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">Auto Rotation</span>
                    <span className="text-[10px] text-slate-500">Spin active model on Y-axis.</span>
                  </div>
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    id="auto-rotate-toggle"
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

                {/* Settings slider for speed */}
                {autoRotate && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="rotation-speed-slider" className="font-semibold text-slate-400">Rotation Speed</label>
                      <span className="font-mono text-indigo-400">{rotationSpeed.toFixed(1)}x</span>
                    </div>
                    <input
                      id="rotation-speed-slider"
                      type="range"
                      min="0.2"
                      max="5.0"
                      step="0.1"
                      value={rotationSpeed}
                      onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                )}

                {/* Grid / Helper lines */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-900">
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">Perspective Grid</span>
                    <span className="text-[10px] text-slate-500">Renders alignment floor lines.</span>
                  </div>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    id="grid-helper-toggle"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showGrid ? "bg-indigo-600" : "bg-slate-850"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        showGrid ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

              </div>

              {/* 2. Asset Specifications Card */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Asset Specifications</h3>
                  <p className="text-[11px] text-slate-500">Active GLB metadata parameters.</p>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-500">Asset Style:</span>
                    <span className="text-slate-300 capitalize">{activeProduct.style}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-500">Format:</span>
                    <span className="text-slate-300">glTF-Binary (.glb)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Rendering Mode:</span>
                    <span className="text-emerald-400">PBR Textures</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* 3. QR Sharing Modal Dialog Overlay */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div 
            className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl relative animate-float"
            id="mobile-share-modal"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all"
              id="close-qr-modal-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {loadingQr ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <h3 className="font-bold text-slate-250 text-sm">Generating Share Link...</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Resolving network address endpoints.
                </p>
              </div>
            ) : (
              <div className="space-y-5 text-center">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    Visualize on Phone Camera
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Scan the QR code below to inspect the 3D {activeProduct.name} in your room.
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="w-60 h-60 mx-auto rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center overflow-hidden p-3 shadow-inner">
                  {qrCodeImgUrl ? (
                    <img
                      src={qrCodeImgUrl}
                      alt="Furniture 3D QR Code"
                      className="w-full h-full object-contain rounded-lg"
                      id="qr-code-img"
                    />
                  ) : (
                    <div className="text-xs text-slate-600 font-mono">No Code</div>
                  )}
                </div>

                {/* Instructions info box */}
                <div className="p-3.5 rounded-xl border border-indigo-500/10 bg-indigo-500/5 text-left space-y-1">
                  <span className="text-[11px] font-bold text-indigo-300 block flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.282 7.657C8.5 7.61 8.74 7.6 9 7.6c1.173 0 2.259.417 3.1 1.1l.6.48m.01 0a4.49 4.49 0 011.888-1.58M12.71 8.08a4.49 4.49 0 00-1.89-1.58m1.89 1.58V15.75m0-7.67v7.67" />
                    </svg>
                    Wi-Fi Connection Required
                  </span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Your smartphone must be connected to the **same Wi-Fi network** as this computer to load local 3D assets.
                  </p>
                </div>

                {/* URL display block */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-left">
                  <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Mobile Endpoint</span>
                  <input
                    type="text"
                    readOnly
                    value={mobileShareUrl}
                    className="w-full bg-transparent border-none text-[10px] text-slate-300 focus:outline-none font-mono mt-0.5"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
