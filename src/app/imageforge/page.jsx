"use client";

import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { convertImage, imageToPdf, pdfToImage, compressImage } from "../../lib/api";

export default function ImageForge() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [progress, setProgress] = useState(0);

  // 'convert', 'to-pdf', 'pdf-to-image', 'compress'
  const [category, setCategory] = useState('convert');
  // For 'convert' and 'pdf-to-image'
  const [targetFormat, setTargetFormat] = useState('png');
  // For 'compress'
  const [compressLevel, setCompressLevel] = useState('mild');

  const fileInputRef = useRef(null);

  const categories = [
    { id: 'convert', label: 'Convert' },
    { id: 'to-pdf', label: 'To PDF' },
    { id: 'pdf-to-image', label: 'PDF to Image' },
    { id: 'compress', label: 'Compress' },
  ];

  const convertFormats = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff', 'gif'];
  const pdfToImageFormats = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff'];
  const compressLevels = ['mild', 'heavy'];

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-brand-violet/50', 'bg-brand-violet/5', 'scale-[1.01]');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-brand-violet/50', 'bg-brand-violet/5', 'scale-[1.01]');
  };

  const validateFile = (selectedFile) => {
    const name = selectedFile.name.toLowerCase();

    if (category === 'pdf-to-image') {
      if (!name.endsWith('.pdf')) {
        setStatus({ type: 'error', message: 'Please upload a PDF file.' });
        return false;
      }
    } else if (category === 'compress') {
      const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
      if (!allowed.some(ext => name.endsWith(ext))) {
        setStatus({ type: 'error', message: 'Invalid image type for compression. Supported: JPG, PNG, WEBP.' });
        return false;
      }
    } else {
      const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.gif'];
      if (!allowed.some(ext => name.endsWith(ext))) {
        setStatus({ type: 'error', message: 'Invalid image type. Supported: JPG, PNG, WEBP, BMP, TIFF, GIF.' });
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
    setStatus({ type: 'info', message: 'Forging your files...' });
    setProgress(30);

    try {
      setProgress(60);
      let blob;
      let downloadExt = targetFormat;

      if (category === 'convert') {
        blob = await convertImage(file, targetFormat);
      } else if (category === 'to-pdf') {
        blob = await imageToPdf(file);
        downloadExt = 'pdf';
      } else if (category === 'pdf-to-image') {
        blob = await pdfToImage(file, targetFormat);
      } else if (category === 'compress') {
        blob = await compressImage(file, compressLevel);
        downloadExt = file.name.split('.').pop();
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      link.download = category === 'compress' ? `${originalName}-compressed.${downloadExt}` : `${originalName}.${downloadExt}`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setProgress(100);
      setStatus({ type: 'success', message: 'Success! Your file is descending...' });

      setTimeout(() => {
        setFile(null);
        setProgress(0);
        setStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message || 'The forge failed. Please try again.' });
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const switchCategory = (newCat) => {
    setCategory(newCat);
    setFile(null);
    setStatus({ type: '', message: '' });
    setProgress(0);
    if (newCat === 'convert') setTargetFormat('png');
    else if (newCat === 'pdf-to-image') setTargetFormat('png');
    else if (newCat === 'compress') setCompressLevel('mild');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center p-6 md:p-12 font-sans selection:bg-brand-violet/30 outline-none">
      <Head>
        <title>ImageForge | Professional Image Conversion</title>
      </Head>


      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center ">
        {/* Header section */}
        <header className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-violet">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h1 className="text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-3 font-outfit uppercase">
            ImageForge<span className="text-brand-violet">.</span>
          </h1>
          <p className="text-zinc-400 text-lg font-medium leading-relaxed font-sans">
            Instant image optimizations and conversions.
          </p>
        </header>

        {/* Interface Card */}
        <div className="w-full premium-glass rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white/5 animate-fade-in shimmer">

          {/* Category Selector */}
          <div className="relative flex p-1.5 bg-zinc-900/50 rounded-2xl mb-6 gap-2 border border-white/5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => switchCategory(cat.id)}
                className={`relative z-10 flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 font-outfit ${category === cat.id ? 'bg-brand-violet text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Format/Level Selector (Conditional) */}
          {(category === 'convert' || category === 'pdf-to-image') && (
            <div className="mb-8 animate-fade-in">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2">Target Format</p>
              <div className="flex flex-wrap gap-2">
                {(category === 'convert' ? convertFormats : pdfToImageFormats).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all duration-300 ${targetFormat === fmt ? 'bg-white/10 border-brand-violet text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'}`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {category === 'compress' && (
            <div className="mb-8 animate-fade-in">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2">Compression Level</p>
              <div className="flex gap-2">
                {compressLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setCompressLevel(lvl)}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all duration-300 ${compressLevel === lvl ? 'bg-white/10 border-brand-violet text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                accept={category === 'pdf-to-image' ? ".pdf" : category === 'compress' ? ".jpg,.jpeg,.png,.webp" : ".jpg,.jpeg,.png,.webp,.bmp,.tiff,.gif"}
              />

              <div className="relative z-10">
                <div className="mb-8 mx-auto w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-brand-violet group-hover:bg-brand-violet group-hover:text-white transition-all duration-500 shadow-xl group-hover:rotate-6">
                  {category === 'pdf-to-image' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15h6" /><path d="M9 11h6" /><path d="M9 19h6" /></svg>
                  ) : category === 'compress' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14V4a2 2 0 0 1 2-2h10l4 4v14a2 2 0 0 1-2 2H10" /><polyline points="14 2 14 6 20 6" /><path d="M9 14v1" /><path d="M12 11v4" /><path d="M15 13v2" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white mb-3 font-outfit">
                  {category === 'pdf-to-image' ? 'Select PDF' : category === 'compress' ? 'Select Image' : 'Select Image'}
                </h3>
                <p className="text-zinc-500 font-medium tracking-wide">
                  {category === 'pdf-to-image' ? 'Supports PDF documents' : category === 'compress' ? 'Supports JPG, PNG, WEBP' : 'Supports JPG, PNG, WEBP, BMP, etc.'}
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
                    {category === 'pdf-to-image' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    )}
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
                    <span>Optimizing...</span>
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
                    Forging
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300 uppercase tracking-[0.2em] font-black font-outfit">Begin Forge</span>
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

        <footer className="mt-10 flex flex-wrap justify-center gap-10 animate-fade-in lg:delay-500">
          <div className="flex items-center gap-3 text-zinc-600 hover:text-zinc-400 transition-colors cursor-default">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3.6c-2 2-2 5.4 0 7.4" /><path d="M3.6 21c2-2 5.4-2 7.4 0" /><circle cx="12" cy="12" r="10" /></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">LOSSLESS</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-600 hover:text-zinc-400 transition-colors cursor-default">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">SOCIAL-READY</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
