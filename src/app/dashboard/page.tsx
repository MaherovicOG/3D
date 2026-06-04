"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import UploadComponent from "@/components/UploadComponent";
import ThreeViewer from "@/components/ThreeViewer";
import ModelViewerPanel from "@/components/ModelViewerPanel";

// High-quality SVG design templates for initial load (offline/instant)
const SODA_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060b26" />
      <stop offset="50%" stop-color="#140f30" />
      <stop offset="100%" stop-color="#2d053d" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bg)" />
  <circle cx="200" cy="220" r="100" fill="none" stroke="url(#textGrad)" stroke-width="2" stroke-dasharray="8 6" opacity="0.4" />
  <text x="200" y="235" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="url(#textGrad)" text-anchor="middle" letter-spacing="4">AETHER</text>
  <text x="200" y="275" font-family="system-ui, sans-serif" font-weight="400" font-size="12" fill="#a5b4fc" text-anchor="middle" letter-spacing="6">ELIXIR LABS</text>
  <rect x="60" y="440" width="280" height="1" fill="url(#textGrad)" opacity="0.4" />
  <text x="200" y="480" font-family="system-ui, sans-serif" font-weight="300" font-size="11" fill="#94a3b8" text-anchor="middle" letter-spacing="1">ZERO SUGAR • HYDRATION EXTRACT</text>
</svg>
`)}`;

const SHOE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#ef4444" />
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg2)" />
  <circle cx="250" cy="250" r="160" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.15" />
  <path d="M 120 280 Q 200 130 380 200 Q 300 260 120 280 Z" fill="url(#accent)" opacity="0.85" />
  <text x="250" y="375" font-family="system-ui, sans-serif" font-weight="800" font-size="34" fill="#ffffff" text-anchor="middle" letter-spacing="3">SOLARA RUN</text>
  <text x="250" y="410" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="#f59e0b" text-anchor="middle" letter-spacing="5">LIMITED EDITION ORANGE</text>
</svg>
`)}`;

const DEVICE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg3)" />
  <rect x="25" y="25" width="350" height="350" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.1" />
  <text x="200" y="170" font-family="system-ui, sans-serif" font-weight="800" font-size="26" fill="#0f172a" text-anchor="middle" letter-spacing="5">NOVA TECH</text>
  <text x="200" y="200" font-family="system-ui, sans-serif" font-weight="300" font-size="10" fill="#475569" text-anchor="middle" letter-spacing="3">PREMIUM WATCH INTERFACE</text>
  <circle cx="200" cy="270" r="16" fill="none" stroke="#0f172a" stroke-width="2" />
  <path d="M 194 270 L 206 270 M 200 264 L 200 276" stroke="#0f172a" stroke-width="1.5" />
</svg>
`)}`;

const RUG_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bgRug" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#311042" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bgRug)" />
  <rect x="20" y="20" width="560" height="360" fill="none" stroke="url(#gold)" stroke-width="4" opacity="0.6" />
  <rect x="40" y="40" width="520" height="320" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="10 5" opacity="0.3" />
  <polygon points="300,120 350,200 300,280 250,200" fill="url(#gold)" opacity="0.8" />
  <text x="300" y="208" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#1e1b4b" text-anchor="middle" letter-spacing="3">ORIENTAL</text>
  <path d="M 0,0 L 0,400 M 600,0 L 600,400" stroke="#fbbf24" stroke-width="10" stroke-dasharray="2 4" opacity="0.4" />
</svg>
`)}`;

interface Product {
  id: string;
  name: string;
  category: string;
  imageBase64: string;
  createdAt: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "default-4",
    name: "Classic Persian Rug",
    category: "rug",
    imageBase64: RUG_SVG,
    createdAt: Date.now() - 4000,
  },
  {
    id: "default-1",
    name: "Aether Energy Can",
    category: "packaging",
    imageBase64: SODA_SVG,
    createdAt: Date.now() - 3000,
  },
  {
    id: "default-2",
    name: "Solara Sneaker Label",
    category: "apparel",
    imageBase64: SHOE_SVG,
    createdAt: Date.now() - 2000,
  },
  {
    id: "default-3",
    name: "Nova Smartwatch Face",
    category: "electronics",
    imageBase64: DEVICE_SVG,
    createdAt: Date.now() - 1000,
  },
];

export default function Dashboard() {
  // App states
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"canvas" | "ar">("canvas");

  // Three.js renderer customization states
  const [shapeStyle, setShapeStyle] = useState<string>("packaging");
  const [bgColor, setBgColor] = useState<"studio" | "light" | "dark" | "transparent">("studio");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.5);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  // QR sharing states
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeImgUrl, setQrCodeImgUrl] = useState("");
  const [mobileShareUrl, setMobileShareUrl] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);

  // Load products from localStorage or use defaults
  useEffect(() => {
    const saved = localStorage.getItem("aether_3d_products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        setProducts(parsed);
        if (parsed.length > 0) {
          setActiveProduct(parsed[0]);
          setShapeStyle(parsed[0].category);
        }
      } catch (e) {
        console.error("Failed to parse localStorage products", e);
        setProducts(DEFAULT_PRODUCTS);
        setActiveProduct(DEFAULT_PRODUCTS[0]);
        setShapeStyle(DEFAULT_PRODUCTS[0].category);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
      setActiveProduct(DEFAULT_PRODUCTS[0]);
      setShapeStyle(DEFAULT_PRODUCTS[0].category);
      localStorage.setItem("aether_3d_products", JSON.stringify(DEFAULT_PRODUCTS));
    }
  }, []);

  // Update localStorage when product list changes
  const saveProducts = (updatedList: Product[]) => {
    setProducts(updatedList);
    localStorage.setItem("aether_3d_products", JSON.stringify(updatedList));
  };

  // Handle uploaded asset
  const handleUploadComplete = (data: { imageBase64: string; name: string; category: string }) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: data.name,
      category: data.category,
      imageBase64: data.imageBase64,
      createdAt: Date.now(),
    };

    const updated = [newProduct, ...products];
    saveProducts(updated);
    setActiveProduct(newProduct);
    setShapeStyle(data.category);
    
    // Auto switch to Three.js simulation tab
    setActiveTab("canvas");
  };

  // Select a product from history
  const selectProduct = (prod: Product) => {
    setActiveProduct(prod);
    setShapeStyle(prod.category);
  };

  // Delete product from gallery
  const deleteProduct = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const filtered = products.filter((p) => p.id !== id);
    saveProducts(filtered);

    // If active product was deleted, pick the next one, or null
    if (activeProduct?.id === id) {
      if (filtered.length > 0) {
        setActiveProduct(filtered[0]);
        setShapeStyle(filtered[0].category);
      } else {
        setActiveProduct(null);
      }
    }
  };

  // Clear all products
  const clearGallery = () => {
    if (confirm("Are you sure you want to clear your studio gallery history?")) {
      saveProducts([]);
      setActiveProduct(null);
    }
  };

  // Generate QR Code for Phone/Mobile AR view
  const handleShareMobile = async () => {
    if (!activeProduct) return;
    setLoadingQr(true);
    setIsQrModalOpen(true);

    try {
      let imageUrl = activeProduct.imageBase64;

      // Since raw data URIs are too large for QR codes, upload the file to get a static URL
      if (imageUrl.startsWith("data:")) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: imageUrl }),
        });
        const uploadData = await uploadRes.json();
        
        if (uploadData.url) {
          imageUrl = uploadData.url;
        } else {
          throw new Error(uploadData.error || "Upload endpoint failed");
        }
      }

      // Fetch host machine local network IP address
      const infoRes = await fetch("/api/info");
      const infoData = await infoRes.json();
      const localIp = infoData.localIp || "localhost";

      // Build target phone link
      const port = window.location.port ? `:${window.location.port}` : "";
      const baseShareUrl = `http://${localIp}${port}/mobile-view?image=${encodeURIComponent(
        imageUrl
      )}&style=${shapeStyle}&name=${encodeURIComponent(activeProduct.name)}`;
      
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
      
      {/* 1. Left Sidebar - Asset Gallery */}
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

          {/* Upload Component Panel */}
          <div className="mb-6">
            <UploadComponent onUpload={handleUploadComplete} />
          </div>

          {/* Product Gallery List */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Studio Assets</h3>
              {products.length > 0 && (
                <button
                  onClick={clearGallery}
                  id="clear-gallery-btn"
                  className="text-[10px] text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <div className="border border-dashed border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs">
                No active assets. Upload an image above to populate the library.
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => selectProduct(prod)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group ${
                      activeProduct?.id === prod.id
                        ? "bg-slate-900 border-indigo-500/50 shadow-md shadow-indigo-500/5"
                        : "bg-slate-900/30 border-slate-900 hover:border-slate-800 hover:bg-slate-900/60"
                    }`}
                    id={`asset-card-${prod.id}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-1 shrink-0">
                      <img src={prod.imageBase64} alt={prod.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-semibold text-slate-200 truncate">{prod.name}</h4>
                      <p className="text-[10px] text-slate-500 capitalize">{prod.category}</p>
                    </div>
                    <button
                      onClick={(e) => deleteProduct(e, prod.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-950/50 hover:text-red-400 text-slate-500 transition-all"
                      title="Remove product"
                      id={`delete-asset-${prod.id}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <h1 className="text-lg font-bold text-slate-200" id="main-workspace-title">
              {activeProduct ? activeProduct.name : "Studio Workspace"}
            </h1>
            {activeProduct && (
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 capitalize">
                {activeProduct.category}
              </span>
            )}
          </div>

          <div className="flex items-center">
            {/* Mobile Share Button */}
            {activeProduct && (
              <button
                onClick={handleShareMobile}
                id="mobile-share-btn"
                className="mr-3 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold flex items-center gap-1.5 transition-all text-white shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l.908-.452a2.25 2.25 0 102.247-2.202 2.25 2.25 0 00-2.247 2.202m-.908.452l.908.452m0 0a2.25 2.25 0 102.247 2.202 2.25 2.25 0 00-2.247-2.202" />
                </svg>
                Mobile AR (QR Code)
              </button>
            )}

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
          {activeProduct ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
              
              {/* Left Column: Visual Viewport (span 2) */}
              <div className="xl:col-span-2 space-y-4">
                {activeTab === "canvas" ? (
                  <ThreeViewer
                    imageSrc={activeProduct.imageBase64}
                    style={shapeStyle}
                    autoRotate={autoRotate}
                    bgColor={bgColor}
                    rotationSpeed={rotationSpeed}
                    showGrid={showGrid}
                  />
                ) : (
                  <ModelViewerPanel imageSrc={activeProduct.imageBase64} style={shapeStyle} />
                )}

                {/* Hotkeys and Instructions Helper */}
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 text-xs text-slate-500 space-y-1">
                  <span className="font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    Studio Tips
                  </span>
                  <p>• Drag the mouse on the 3D scene to rotate camera around the model.</p>
                  <p>• Use the scroll wheel to zoom in and out of the viewport.</p>
                  <p>• Shift + click + drag to translate/pan the scene camera view.</p>
                </div>
              </div>

              {/* Right Column: Style & Renderer Settings */}
              <div className="space-y-6">
                
                {/* 1. Simulation Controls Card */}
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Simulation Controls</h3>
                    <p className="text-[11px] text-slate-500">Fine-tune the direct Three.js renderer parameters.</p>
                  </div>

                  {/* Geometric Shape Choice */}
                  <div className="space-y-2">
                    <label htmlFor="shape-representation" className="block text-xs font-semibold text-slate-400">3D Representation Shape</label>
                    <select
                      id="shape-representation"
                      value={shapeStyle}
                      onChange={(e) => setShapeStyle(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl glass-input bg-slate-900"
                    >
                      <option value="rug">Rug / Floor Plane</option>
                      <option value="plane">Flat Plane Simulation</option>
                      <option value="packaging">Extruded Box (Thick - BoxGeometry)</option>
                      <option value="cosmetics">Extruded Bottle (Medium - BoxGeometry)</option>
                      <option value="electronics">Thin Device (Thin - BoxGeometry)</option>
                      <option value="parallax">Parallax Float (Dual Layered Planes)</option>
                    </select>
                  </div>

                  {/* Viewport Theme background */}
                  <div className="space-y-2">
                    <label htmlFor="viewport-theme" className="block text-xs font-semibold text-slate-400">Viewport Theme Environment</label>
                    <div id="viewport-theme" className="grid grid-cols-2 gap-2">
                      {[
                        { id: "studio", label: "Studio Gradient" },
                        { id: "dark", label: "Solid Black" },
                        { id: "light", label: "Clean Light" },
                        { id: "transparent", label: "Transparent Grid" },
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
                      <span className="text-[10px] text-slate-500">Rotate Y-axis automatically.</span>
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
                      <span className="text-xs font-semibold text-slate-300 block">Show Perspective Grid</span>
                      <span className="text-[10px] text-slate-500">Display alignment helpers.</span>
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

                {/* 2. Metadata Editor Card */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Asset Parameters</h3>
                    <p className="text-[11px] text-slate-500">Edit current product label properties.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="meta-product-name" className="block text-xs font-semibold text-slate-400 mb-1">Rename Label</label>
                      <input
                        id="meta-product-name"
                        type="text"
                        value={activeProduct.name}
                        onChange={(e) => {
                          const updated = products.map((p) => {
                            if (p.id === activeProduct.id) {
                              return { ...p, name: e.target.value };
                            }
                            return p;
                          });
                          saveProducts(updated);
                          setActiveProduct({ ...activeProduct, name: e.target.value });
                        }}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl glass-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="meta-product-category" className="block text-xs font-semibold text-slate-400 mb-1">Preset Category</label>
                      <select
                        id="meta-product-category"
                        value={activeProduct.category}
                        onChange={(e) => {
                          const updated = products.map((p) => {
                            if (p.id === activeProduct.id) {
                              return { ...p, category: e.target.value };
                            }
                            return p;
                          });
                          saveProducts(updated);
                          setActiveProduct({ ...activeProduct, category: e.target.value });
                          setShapeStyle(e.target.value);
                        }}
                        className="w-full text-xs px-3 py-2.5 rounded-xl glass-input bg-slate-900"
                      >
                        <option value="rug">Rug / Floor Plane</option>
                        <option value="packaging">Box / Packaging</option>
                        <option value="electronics">Device / Electronics</option>
                        <option value="apparel">Apparel / Footwear</option>
                        <option value="cosmetics">Bottle / Cosmetics</option>
                        <option value="card">Card / Flat Plane</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="max-w-md mx-auto mt-20 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-200">No Asset Selected</h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Please upload a new image or pick one of the default templates in the left sidebar to initialize the 3D studio.
                </p>
              </div>
            </div>
          )}
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
                <h3 className="font-bold text-slate-250 text-sm">Processing Studio Asset...</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Uploading design and detecting local network connection addresses.
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
                    Scan the QR code below to inspect this 3D product mockup inside your room.
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="w-60 h-60 mx-auto rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center overflow-hidden p-3 shadow-inner">
                  {qrCodeImgUrl ? (
                    <img
                      src={qrCodeImgUrl}
                      alt="Product 3D QR Code"
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
                    Your smartphone must be connected to the **same Wi-Fi network** as this computer to visualize local assets.
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
