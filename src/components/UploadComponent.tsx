"use client";

import React, { useState, useRef } from "react";

interface UploadComponentProps {
  onUpload: (data: { imageBase64: string; name: string; category: string }) => void;
}

export default function UploadComponent({ onUpload }: UploadComponentProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("packaging");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      // Auto-populate name if empty
      if (!productName) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        setProductName(nameWithoutExt);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerate = () => {
    if (!previewUrl) return;
    onUpload({
      imageBase64: previewUrl,
      name: productName || "Unnamed Product",
      category: category,
    });
  };

  const triggerReset = () => {
    setPreviewUrl(null);
    setProductName("");
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full justify-between">
      <div>
        <h2 className="text-xl font-bold mb-1 text-slate-100 flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Upload Asset
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Upload a transparent PNG or JPG to visualize in 3D.
        </p>

        {/* Drag and Drop Zone */}
        {!previewUrl ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] ${
              dragActive
                ? "border-indigo-500 bg-indigo-500/10 scale-[0.98]"
                : "border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50"
            }`}
            onClick={onButtonClick}
            id="drag-drop-zone"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
              id="file-upload-input"
            />
            
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>

            <p className="text-sm font-semibold text-slate-200">Drag & Drop image here</p>
            <p className="text-xs text-slate-500 mt-1">or click to browse from files</p>
            <p className="text-[10px] text-indigo-400/70 mt-3 font-mono">PNG, JPG or WEBP up to 10MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden flex items-center justify-center p-4 min-h-[220px]">
              <img
                src={previewUrl}
                alt="Product preview"
                className="max-h-[200px] object-contain rounded-lg animate-float"
              />
              <button
                onClick={triggerReset}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all duration-200"
                title="Remove image"
                id="remove-image-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Product Meta Data */}
            <div className="space-y-3">
              <div>
                <label htmlFor="product-name" className="block text-xs font-semibold text-slate-400 mb-1">
                  Product Name
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product title..."
                  className="w-full text-sm px-3.5 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label htmlFor="product-category" className="block text-xs font-semibold text-slate-400 mb-1">
                  Product Type
                </label>
                <select
                  id="product-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl glass-input bg-slate-900"
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
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!previewUrl}
        id="generate-3d-btn"
        className={`w-full mt-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 border transition-all duration-300 ${
          previewUrl
            ? "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 hover:shadow-indigo-500/25 text-white cursor-pointer active:scale-[0.98]"
            : "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-8.983m-8.982 8.983a1.5 1.5 0 01-1.075-2.585l9.957-9.958m-8.882 12.544l1.109-2.217m0 0a1.5 1.5 0 012.1-.678l2.218 1.11m-2.218-1.11L12 10.5m-3.187 5.404L7.5 12m0 0a1.5 1.5 0 011.075-2.585l1.075-.107m0 0L10.5 7.5" />
        </svg>
        Generate 3D Preview
      </button>
    </div>
  );
}
