import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

/**
 * Generates a GLB Blob from a HTMLCanvasElement containing a processed transparent image.
 * Renders the canvas onto a double-sided 3D Plane with shadows and correct aspect ratio.
 */
export function generateGlbFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // 1. Create a scene, lights, and plane mesh
      const scene = new THREE.Scene();
      
      // Calculate aspect ratio
      const width = canvas.width || 512;
      const height = canvas.height || 512;
      const aspect = width / height;
      
      // Create a texture from the canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      
      // Create plane matching aspect ratio (normalized to height = 1.0)
      const geometry = new THREE.PlaneGeometry(aspect, 1.0);
      
      // Material with transparency and double-sided rendering
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.2, // Ensure transparent pixels don't cast shadows
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = "custom-object-cutout";
      
      // Center the mesh vertically so it rests on its bottom edge
      mesh.position.y = 0.5;
      
      scene.add(mesh);
      
      // Add light source to make PBR materials render nicely when exported
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(2, 4, 3);
      scene.add(dirLight);

      // 2. Export scene to binary GLTF (GLB)
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          if (gltf instanceof ArrayBuffer) {
            const blob = new Blob([gltf], { type: "model/gltf-binary" });
            resolve(blob);
          } else {
            // If parsed as JSON structure (should not happen with binary: true)
            const stringified = JSON.stringify(gltf);
            const blob = new Blob([stringified], { type: "application/json" });
            resolve(blob);
          }
        },
        (error) => {
          reject(error);
        },
        {
          binary: true,
          animations: [],
          includeCustomExtensions: false
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * A smart border-connected BFS (Breadth-First Search) background removal algorithm.
 * Starts from all four outer edges and keys out connected pixels that are close
 * to the edge colors. This keeps internal pixels of the product intact even if
 * they match the background color.
 */
export function removeBackgroundSmarter(canvas: HTMLCanvasElement, tolerance: number): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Sample the 4 corners to find initial background colors
  const getPixelColor = (x: number, y: number) => {
    const idx = (y * width + x) * 4;
    return { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
  };

  const corners = [
    getPixelColor(0, 0),
    getPixelColor(width - 1, 0),
    getPixelColor(0, height - 1),
    getPixelColor(width - 1, height - 1),
  ];

  // Queue for BFS and visited flag array
  const queue: [number, number][] = [];
  const visited = new Uint8Array(width * height);

  // Push all border pixels to queue as seed points
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
    visited[0 * width + x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
    visited[y * width + 0] = 1;
    visited[y * width + (width - 1)] = 1;
  }

  // Helper to check if a pixel matches any corner background color
  const isBgColor = (r: number, g: number, b: number) => {
    for (const corner of corners) {
      const dist = Math.sqrt(
        Math.pow(r - corner.r, 2) +
        Math.pow(g - corner.g, 2) +
        Math.pow(b - corner.b, 2)
      );
      if (dist < tolerance) return true;
    }
    return false;
  };

  // 2. Perform BFS from edges inwards
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const idx = (cy * width + cx) * 4;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    if (isBgColor(r, g, b)) {
      // Key out this pixel
      data[idx + 3] = 0;

      // Add 4-connected neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = ny * width + nx;
          if (visited[nidx] === 0) {
            visited[nidx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Utility to load an image URL safely with CORS settings and draw it to a canvas.
 */
export function loadImageToCanvas(url: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      } else {
        reject(new Error("Failed to get 2D context from canvas"));
      }
    };
    img.onerror = (err) => {
      reject(new Error(`Failed to load image at URL: ${url}`));
    };
    img.src = url;
  });
}
