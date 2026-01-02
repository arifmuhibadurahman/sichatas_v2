"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-[#0A2A45]/70 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}>
            <Image src="/logoWOI.png" alt="Logo" width={42} height={42} className="drop-shadow-lg" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter leading-none italic text-white">SICHATAS</span>
            <span className="text-[10px] text-blue-400 font-bold tracking-[0.2em]">GIS PLATFORM</span>
          </div>
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex gap-8 text-xs font-bold tracking-widest">
            {['BERANDA', 'FITUR', 'MAP', 'DATA'].map((item) => {
              const href = item === 'BERANDA' ? '/' : `/${item.toLowerCase()}`;
              const isActive = pathname === href;
              return (
                <li key={item} className="relative py-2">
                  <Link 
                    href={href} 
                    className={`transition-all duration-300 ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}`}
                  >
                    {item}
                  </Link>
                  {isActive && (
                    <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}