"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL from "@urbica/react-map-gl";
import { 
  ArrowRight, Map, Lightbulb, ShieldCheck, 
  Activity, Database, Server, Cpu
} from "lucide-react";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

const MAP_SERVICE_KEY = process.env.NEXT_PUBLIC_MAPID_KEY || "";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Background Map Component
const BackgroundMap = () => {
  const [viewport, setViewport] = useState({
    latitude: -6.914744,
    longitude: 107.609811,
    zoom: 12.5,
  });

  return (
    <div className="absolute inset-0 z-0 grayscale-[0.6] brightness-[0.3] contrast-[1.1]">
      <MapGL
        mapStyle={`https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`}
        accessToken={MAPBOX_TOKEN}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={setViewport}
        dragPan={false}
        scrollZoom={false}
      />
      {/* Overlay gradien agar teks tetap kontras */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A2A45] via-[#0A2A45]/40 to-transparent" />
    </div>
  );
};

export default function Home() {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col min-h-screen bg-[#0A2A45] text-white ${ubuntu.className} overflow-x-hidden`}>
      
      {/* 1. FIXED NAVBAR DENGAN GLASSMORPHISM */}
      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-[#0A2A45]/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}>
              <Image src="/logoWOI.png" alt="Logo" width={42} height={42} className="drop-shadow-lg" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter leading-none italic">SICHATAS</span>
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
                    <Link href={href} className={`transition-all duration-300 ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}`}>
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

      {/* 2. MAIN CONTENT - Diberi padding-top agar tidak nabrak navbar */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-24 lg:pt-32 pb-20 overflow-hidden">
          <BackgroundMap />
          
          <div className="container mx-auto px-6 z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7"
              >
                {/* Badge Version - Disini perbaikan jaraknya */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] font-black mb-8 backdrop-blur-sm">
                  <Activity size={14} className="animate-pulse" />
                  SISTEM PERENCANAAN CERDAS v2.0
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.05] tracking-tight">
                  Analisis Lokasi <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Hunian Strategis.
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                  Optimasi pembangunan berbasis geospasial menggunakan integrasi data <strong>OpenStreetMap</strong> dan <strong>Raster QGIS</strong> untuk keputusan yang lebih akurat.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link href="/map" className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_15px_30px_-10px_rgba(37,99,235,0.5)]">
                    Lihat Peta Interaktif
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link href="/data" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-4 rounded-xl font-bold backdrop-blur-md transition-all flex items-center justify-center gap-3">
                    <Database size={18} className="text-blue-400" />
                    Sumber Data
                  </Link>
                </div>
              </motion.div>

              {/* Data Floating Card (Visual tambahan agar terlihat rumit/pro) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="lg:col-span-5 hidden lg:block"
              >
                <div className="bg-gradient-to-br from-white/10 to-transparent p-1 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="bg-[#0A2A45]/80 p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Live Spatial Metrics</span>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { label: "Vector Processing", val: "94%", color: "bg-blue-500", icon: <Server size={16}/> },
                        { label: "Raster Rendering", val: "88%", color: "bg-cyan-500", icon: <Cpu size={16}/> },
                        { label: "System Uptime", val: "99.9%", color: "bg-emerald-500", icon: <Activity size={16}/> }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                            <span className="flex items-center gap-2 text-gray-400">{item.icon} {item.label}</span>
                            <span className="text-white">{item.val}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: item.val }}
                              transition={{ duration: 2, delay: 0.5 }}
                              className={`h-full ${item.color}`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-4 text-gray-400 italic text-sm">
                        <Map size={24} className="text-blue-500 opacity-50" />
                        "Sistem mengoptimalkan 45+ parameter kelayakan lahan secara real-time."
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 2: VALUES */}
        <section className="py-24 bg-[#081d30]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Membangun Masa Depan Berbasis Data.</h2>
                <p className="text-gray-400 italic font-light">SICATHAS menggabungkan parameter kesehatan lingkungan dengan kemudahan aksesibilitas.</p>
              </div>
              <div className="h-0.5 flex-grow bg-white/5 mx-10 hidden md:block" />
              <div className="text-blue-400 font-black text-6xl opacity-20 hidden lg:block">01</div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <ValueCard icon={<Map />} title="Interactive Maps" desc="Visualisasi spasial detail dengan dukungan tiling raster dan data vektor OSM." />
              <ValueCard icon={<ShieldCheck />} title="Reliable Analysis" desc="Hasil perhitungan parameter kesehatan hunian yang tervalidasi secara teknis." />
              <ValueCard icon={<Lightbulb />} title="Smart Planning" desc="Membantu pengambil kebijakan dalam menentukan zonasi pembangunan strategis." />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#05111b] border-t border-white/5 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-xs tracking-widest uppercase font-bold">
            © {new Date().getFullYear()} SICHATAS — Geographic Information System Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for Cleanliness
function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group"
    >
      <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}