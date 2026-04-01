"use client";

import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { convertDoc } from "../../lib/api";

export default function FileForge() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('to-pdf'); // 'to-pdf' or 'to-docx'
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-brand-violet/50', 'bg-brand-violet/5', 'scale-[1.01]');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-brand-violet/50', 'bg-brand-violet/5', 'scale-[1.01]');
  };

  const validateFile = (selectedFile) => {
    const name = selectedFile.name.toLowerCase();
    if (activeTab === 'to-pdf') {
      const allowed = ['.docx', '.doc', '.pptx', '.ppt', '.xlsx', '.xls'];
      if (!allowed.some(ext => name.endsWith(ext))) {
        setStatus({ type: 'error', message: 'Invalid file type. Please upload a Word, PowerPoint, or Excel document.' });
        return false;
      }
    } else {
      if (!name.endsWith('.pdf')) {
        setStatus({ type: 'error', message: 'Invalid file type. Please upload a PDF document.' });
        return false;
      }
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-brand-violet/50', 'bg-brand-violet/5', 'scale-[1.01]');
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setStatus({ type: '', message: '' });
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setStatus({ type: '', message: '' });
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setStatus({ type: 'info', message: 'Processing your file...' });
    setProgress(30);

    const targetFormat = activeTab === 'to-pdf' ? 'pdf' : 'docx';

    try {
      setProgress(60);
      const blob = await convertDoc(file, targetFormat);

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Extract original filename
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      link.download = `${originalName}.${targetFormat}`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setProgress(100);
      setStatus({ type: 'success', message: 'Conversion completed! Downloading...' });

      setTimeout(() => {
        setFile(null);
        setProgress(0);
        setStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message || 'Something went wrong.' });
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center p-6 md:p-12 font-sans selection:bg-brand-violet/30 outline-none">
      <Head>
        <title>FileForge | Professional Document Conversion</title>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .shimmer { position: relative; overflow: hidden; }
          .shimmer::after { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.03), transparent); transform: rotate(45deg); animation: shimmer 3s infinite linear; }
          @keyframes shimmer { 0% { transform: translateX(-100%) rotate(45deg); } 100% { transform: translateX(100%) rotate(45deg); } }
        `}</style>
      </Head>


      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center ">
        {/* Header section */}
        <header className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-violet">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14.5 2 14.5 7 20 7" />
              <path d="M8 13h8" /><path d="M8 17h8" /><path d="M10 9h1" />
            </svg>
          </div>
          <h1 className="text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-3 font-outfit uppercase">
            FileForge<span className="text-brand-violet">.</span>
          </h1>
          <p className="text-zinc-400 text-lg font-medium leading-relaxed font-sans">
            Documents transformed with precision.
          </p>
        </header>

        {/* The Conversion Interface */}
        <div className="w-full premium-glass rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white/5 animate-fade-in shimmer">

          {/* Enhanced Tab Switcher */}
          <div className="relative flex p-1.5 bg-zinc-900/50 rounded-2xl mb-8 gap-2 border border-white/5">
            <button
              onClick={() => { setActiveTab('to-pdf'); setFile(null); setStatus({ type: '', message: '' }); }}
              className={`relative z-10 flex-1 py-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 font-outfit ${activeTab === 'to-pdf' ? 'bg-brand-violet text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              Office to PDF
            </button>
            <button
              onClick={() => { setActiveTab('to-docx'); setFile(null); setStatus({ type: '', message: '' }); }}
              className={`relative z-10 flex-1 py-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 font-outfit ${activeTab === 'to-docx' ? 'bg-brand-violet text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              PDF to DOCX
            </button>
          </div>

          {!file ? (
            <div
              className={`group relative border-2 border-dashed rounded-[2rem] py-8 px-6 lg:py-10 lg:px-12 text-center cursor-pointer transition-all duration-500 hover:scale-[1.005] overflow-hidden ${status.type === 'error' ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 hover:border-brand-violet/40 hover:bg-brand-violet/5'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={activeTab === 'to-pdf' ? '.docx,.doc,.pptx,.ppt,.xlsx,.xls' : '.pdf'}
              />

              <div className="relative z-10">
                <div className="mb-8 mx-auto w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-brand-violet group-hover:bg-brand-violet group-hover:text-white transition-all duration-500 shadow-xl group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 font-outfit">Select Document</h3>
                <p className="text-zinc-500 font-medium tracking-wide">
                  {activeTab === 'to-pdf'
                    ? 'Word, PPT, or Excel files'
                    : 'PDF documents only'}
                </p>
                <div className="mt-8 px-8 py-3 rounded-xl border border-white/10 bg-white/5 inline-flex text-[10px] font-black text-white uppercase tracking-[0.2em] group-hover:bg-brand-violet transition-all duration-500 group-hover:border-brand-violet">
                  Browse Files
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between p-6 bg-zinc-900/80 rounded-3xl border border-white/5 group hover:border-brand-violet/30 transition-all">
                <div className="flex items-center gap-5 truncate">
                  <div className="w-16 h-16 bg-brand-violet/20 rounded-2xl flex items-center justify-center text-brand-violet shrink-0 border border-brand-violet/20 group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14.5 2 14.5 7 20 7" /></svg>
                  </div>
                  <div className="truncate">
                    <p className="font-black text-white text-lg truncate leading-tight font-outfit">{file.name}</p>
                    <p className="text-zinc-500 text-sm font-bold mt-1 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB • READY</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-4 bg-red-500/5 hover:bg-red-500/10 rounded-2xl text-red-500/50 hover:text-red-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              {progress > 0 && (
                <div className="space-y-4 px-2">
                  <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    <span>Forging...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden p-1 border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-brand-violet via-brand-pink to-brand-violet rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                className="group relative w-full py-6 bg-white text-black font-black text-xl rounded-[2rem] shadow-2xl transition-all duration-500 transform hover:-translate-y-1 active:scale-[0.97] disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-4 overflow-hidden"
                onClick={handleConvert}
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-violet to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {loading ? (
                  <span className="relative z-10 flex items-center gap-3 text-white uppercase tracking-[0.2em]">
                    <svg className="animate-spin h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300 uppercase tracking-[0.2em] font-black font-outfit">Convert Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1 decoration-3"><polyline points="9 18 15 12 9 6" /></svg>
                  </>
                )}
              </button>
            </div>
          )}

          {status.message && (
            <div className={`mt-8 p-6 rounded-3xl text-center text-xs font-black tracking-[0.1em] uppercase border animate-fade-in backdrop-blur-3xl ${status.type === 'error'
                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                : status.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-brand-violet/10 text-brand-violet border-brand-violet/20'
              }`}>
              {status.message}
            </div>
          )}
        </div>

        {/* Dynamic Footer Information */}
        <footer className="mt-10 flex flex-wrap justify-center gap-10 animate-fade-in lg:delay-500">
          <FooterItem icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} label="SECURE" />
          <FooterItem icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>} label="FAST" />
          <FooterItem icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>} label="PRIVATE" />
        </footer>
      </div>
    </div>
  );
}

function FooterItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 text-zinc-600 hover:text-zinc-400 transition-colors cursor-default">
      <div className="p-2 rounded-lg bg-white/5 border border-white/5">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
    </div>
  );
}