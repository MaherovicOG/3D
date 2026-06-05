"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ThreeViewerProps {
  style: "chair" | "decor" | "desk" | "rug" | string;
  glbBlobUrl?: string;
  autoRotate: boolean;
  bgColor: "studio" | "light" | "dark" | "transparent";
  rotationSpeed: number;
  showGrid: boolean;
}

export default function ThreeViewer({
  style,
  glbBlobUrl,
  autoRotate,
  bgColor,
  rotationSpeed,
  showGrid,
}: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const productMeshGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Loading state for 3D model
  const [loading, setLoading] = useState(true);

  // Background style classes based on selection
  const getContainerBg = () => {
    switch (bgColor) {
      case "light":
        return "bg-slate-100";
      case "dark":
        return "bg-slate-950";
      case "transparent":
        return "bg-transparent bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]";
      case "studio":
      default:
        return "bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40";
    }
  };

  // Export Screenshot
  const exportScreenshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataURL = canvasRef.current?.toDataURL("image/png");
    if (!dataURL) return;

    const link = document.createElement("a");
    link.download = `furniture-studio-${style}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  // Main Scene Setup
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 6); // Point camera slightly downwards
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 15;
    controls.minDistance = 2;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 7, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 0.4);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.25);
    bounceLight.position.set(0, -5, 0);
    scene.add(bounceLight);

    // 6. Grid Helper (Floor level is at y = -2)
    const gridHelper = new THREE.GridHelper(10, 10, 0x4f46e5, 0x1e293b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;
    gridHelper.visible = showGrid;

    // Group to hold the actual product mesh
    const productGroup = new THREE.Group();
    scene.add(productGroup);
    productMeshGroupRef.current = productGroup;

    // 7. Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 500;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (productMeshGroupRef.current && autoRotate) {
        productMeshGroupRef.current.rotation.y += 0.005 * rotationSpeed;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      
      productGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  // Update Grid visibility
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Load GLTF Model dynamically when style changes
  useEffect(() => {
    const scene = sceneRef.current;
    const group = productMeshGroupRef.current;
    if (!scene || !group || !style) return;

    setLoading(true);

    // Clean out existing meshes in group
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
      group.remove(obj);
    }

    // Load GLTF
    const loader = new GLTFLoader();
    const loadUrl = style === "custom" && glbBlobUrl ? glbBlobUrl : `/models/${style}.glb`;
    
    loader.load(
      loadUrl,
      (gltf) => {
        const model = gltf.scene;

        // Traverse to enable shadows and apply styling materials to procedural placeholders
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Apply custom wood/carpet colors to box-textured placeholders
            if (style === "rug" && child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x991b1b, // Crimson red carpet
                roughness: 0.9,
                metalness: 0.05,
              });
            } else if (style === "desk" && child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x854d0e, // Wood walnut/amber color
                roughness: 0.7,
                metalness: 0.1,
              });
            }
          }
        });

        // Apply scale factors based on selected asset
        if (style === "rug") {
          model.scale.set(2.0, 0.005, 3.0); // Flat rug sheet
        } else if (style === "desk") {
          model.scale.set(2.0, 0.75, 1.2); // Desk block
        } else if (style === "decor") {
          model.scale.set(3.5, 3.5, 3.5); // Scale up small duck model
        } else if (style === "chair") {
          model.scale.set(1.6, 1.6, 1.6); // Scale chair
        } else {
          model.scale.set(1.5, 1.5, 1.5);
        }

        // Center the model's geometry
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Align model's base to the floor level (y = -2)
        const sizeY = box.max.y - box.min.y;
        model.position.y = -2 + sizeY / 2;

        if (style === "rug") {
          model.position.y = -1.99; // Rest just above floor to prevent z-fighting
        }

        group.add(model);
        
        // Adjust OrbitControls target to center of the loaded model
        if (controlsRef.current) {
          controlsRef.current.target.set(0, model.position.y, 0);
        }

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Error loading GLTF model:", err);
        setLoading(false);
      }
    );

    // Reset rotation when swapping style
    group.rotation.set(0, 0, 0);
  }, [style, glbBlobUrl]);

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden glass-panel group flex flex-col justify-end">
      {/* 3D Renderer Container */}
      <div ref={containerRef} className={`w-full h-full absolute inset-0 transition-all duration-500 ${getContainerBg()}`}>
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" id="threejs-canvas" />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10 transition-opacity">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-slate-300">Loading 3D Object model...</p>
        </div>
      )}

      {/* Top Floating Info */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-[10px] uppercase font-mono tracking-widest text-indigo-400">
          Preset: {style}
        </span>
      </div>

      {/* Bottom Actions Overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <button
          onClick={exportScreenshot}
          id="export-screenshot-btn"
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 text-xs font-semibold shadow-lg"
          title="Take 3D Screenshot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          Snapshot
        </button>
      </div>

      {/* Orbit Tip */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 bg-slate-950/30 px-2 py-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-1.676-1.345c-.528-.407-1.09-.817-1.676-1.226M15.042 9.152c-.582-.448-1.148-.89-1.676-1.345m1.676 1.345c.528.407 1.09.817 1.676 1.226M16.718 10.5c.528.407 1.09.817 1.676 1.226m-1.676-1.226c-.528-.407-1.09-.817-1.676-1.226m1.676 1.226a40.063 40.063 0 01-1.676-1.345m0 0a40.07 40.07 0 00-1.676-1.226M9 9.75h-.008v.008H9V9.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 2.25h-.008v.008H9V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          Drag to orbit | scroll to zoom
        </span>
      </div>
    </div>
  );
}
