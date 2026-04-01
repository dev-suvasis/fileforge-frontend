import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center p-6 selection:bg-brand-violet/30 outline-none">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] right-[-10%] w-150 h-150 bg-brand-violet/15 blur-[150px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-15%] left-[-15%] w-150 h-150 bg-brand-pink/15 blur-[150px] rounded-full animate-pulse-slow lg:delay-[2s]"></div>
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl text-center space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-[0.3em] text-brand-violet ">
            <span className="w-2 h-2 rounded-full bg-brand-violet "></span>
            Intelligence at work
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 uppercase font-outfit">
            FileForge
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed">
            The next generation of document workflows. <br className="hidden md:block" /> 
            <span className="text-white">Faster. Smarter. Secure.</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-5">
          <Link 
            href="/fileforge"
            className="group relative px-10 py-5 bg-white text-black font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-violet to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 uppercase tracking-widest">
              Forge Documents
            </span>
          </Link>

          <Link 
            href="/imageforge"
            className="group relative px-10 py-5 bg-zinc-900 text-white font-black text-lg rounded-2xl border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 hover:border-brand-violet/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-violet opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="relative z-10 uppercase tracking-widest">
              Forge Images
            </span>
          </Link>
        </div>

        {/* Feature Grid Sneak Peek */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14.5 2 14.5 7 20 7" /></svg>}
            title="Lossless" 
            desc="Preserve layout & fonts with 100% accuracy" 
          />
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
            title="Encrypted" 
            desc="Enterprise grade 256-bit data protection" 
          />
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
            title="Scalable" 
            desc="Built for high-volume conversion pipelines" 
          />
        </div>
      </div>
      
      {/* Inline styles for Home specific fade animation if needed, although global exists */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </main>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 premium-glass rounded-3xl border border-white/5 text-left group hover:border-brand-violet/30 transition-all duration-500">
      <div className="w-12 h-12 mb-6 rounded-2xl bg-white/5 flex items-center justify-center text-brand-violet group-hover:bg-brand-violet/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter font-outfit">{title}</h3>
      <p className="text-zinc-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}