import Link from "next/link";
import React from "react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Background gradients and glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/35 border border-indigo-500">
            A3
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Aether<span className="text-indigo-400">3D</span> Studio
          </span>
        </div>

        <Link
          href="/dashboard"
          id="header-open-dashboard-btn"
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold hover:text-white hover:border-slate-700 transition-all duration-200"
        >
          Open Dashboard
        </Link>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-grow flex flex-col lg:flex-row items-center gap-12 z-10">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-300 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping"></span>
            Prototype v1.0 • Client-side Simulation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The Interactive <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
              3D Product Studio
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Upload flat product packaging, apparel or labels and immediately visualize them in real-time using Three.js depth mapping and interactive AR-ready previews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              href="/dashboard"
              id="hero-primary-cta"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              Start Creating Now
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            
            <a
              href="#features-section"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white font-semibold flex items-center justify-center transition-all"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Visual Showcase */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-float">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-2xl -z-10"></div>
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-900/20 shadow-2xl">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-tr from-slate-950 via-slate-950 to-indigo-950/40 border border-slate-800/60 flex items-center justify-center">
              {/* Dummy floating mockups to represent the 3D space */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:12px_12px] opacity-40"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-100 text-lg">Interactive 3D Engine</h3>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Toggle between cards, mock packaging boxes, and floating parallax planes instantly.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-indigo-400">Three.js</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">Model-Viewer</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-purple-400">WebXR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features-section" className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Full-Featured Prototype Studio</h2>
          <p className="text-slate-400 text-sm font-light">
            Engineered completely on the client-side. No database, server overhead, or signups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-100">PNG to 3D Plane</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload standard product flat renders and automatically project them onto physical geometry with light reaction.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-100">WebAR & VR Preview</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use Google Model Viewer to test positioning inside actual rooms using standard smartphone camera feeds.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.645-.869L9.594 3.94z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-100">Studio Customizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fine-tune the rotation speed, background gradient environment, and grid guides dynamically for client presentations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-100">Direct Captures</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export transparent and high-resolution PNG renders directly from the active Three.js canvas in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-900/50 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-4 z-10">
        <p>© {new Date().getFullYear()} Aether3D Studio. Built for product mockups and WebAR prototype simulations.</p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:text-slate-300">Workspace</Link>
          <span className="text-slate-800">|</span>
          <span className="text-indigo-400/80 font-mono">Client-Side Store (No DB)</span>
        </div>
      </footer>
    </div>
  );
}
