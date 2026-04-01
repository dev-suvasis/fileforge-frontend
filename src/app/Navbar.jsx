"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Helper to check if a path is active (handling trailing slashes)
  const isActive = (href) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end p-6">
      {/* Home Button in top left corner */}
      <div className="absolute left-6 top-6">
        <Link
          href="/"
          className={`p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 shadow-2xl flex items-center justify-center transition-all duration-300 group hover:bg-brand-violet hover:border-brand-violet/50 ${isActive("/") ? "text-brand-violet bg-white/5" : "text-zinc-500 hover:text-white"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </div>

      {/* Tabs in the Right Corner */}
      <div className="flex items-center gap-2 p-1.5 bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl">
        <NavLink href="/fileforge" active={isActive("/fileforge")}>
          Document
        </NavLink>
        <NavLink href="/imageforge" active={isActive("/imageforge")}>
          Image
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 font-outfit border ${
        active 
          ? "bg-brand-violet text-white border-brand-violet shadow-[0_0_20px_rgba(139,92,246,0.6)]" 
          : "text-zinc-500 hover:text-white hover:bg-white/5 border-transparent"
      }`}
    >
      {children}
    </Link>
  );
}