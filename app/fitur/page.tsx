"use client"; // Wajib ditambahkan di baris pertama

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ubuntu } from 'next/font/google';
import { 
  Map as MapIcon, Search, Maximize, Settings, Info, ChevronRight 
} from 'lucide-react';



// Memuat font Ubuntu dari Google Fonts
const ubuntu = Ubuntu({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '700'] 
});


const features = [
  {
    id: 1,
    title: "Navigasi & Visualisasi",
    icon: <MapIcon className="w-6 h-6" />,
    color: "bg-blue-600",
    details: ["Zoom In/Out & Pan", "Layer Management", "Basemap Switcher", "Legend"],
    imageDesc: "Interaksi langsung dengan peta dasar dan pengaturan lapisan data."
  },
  {
    id: 2,
    title: "Pencarian & Query",
    icon: <Search className="w-6 h-6" />,
    color: "bg-emerald-600",
    details: ["Geocoding", "Attribute Query", "Spatial Query"],
    imageDesc: "Menemukan data spesifik berdasarkan nama lokasi atau parameter atribut."
  },
  {
    id: 3,
    title: "Analisis Spasial",
    icon: <Maximize className="w-6 h-6" />,
    color: "bg-purple-600",
    details: ["Buffering", "Measurement Tools", "Overlay Analysis", "Network Analysis"],
    imageDesc: "Proses pengolahan data untuk menghasilkan informasi spasial baru."
  },
  {
    id: 4,
    title: "Pengelolaan Data",
    icon: <Settings className="w-6 h-6" />,
    color: "bg-orange-600",
    details: ["Add/Edit Data", "Import/Export (.shp, .kml)", "Printing & Layout"],
    imageDesc: "Manipulasi database spasial dan publikasi hasil peta."
  },
  {
    id: 5,
    title: "Informasi & Interaksi",
    icon: <Info className="w-6 h-6" />,
    color: "bg-pink-600",
    details: ["Pop-up Information", "Dashboard & Charting", "Time Slider"],
    imageDesc: "Penyajian data non-spasial yang terhubung dengan objek geografis."
  }
];

export default function FiturPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className={`min-h-screen bg-slate-50 p-6 md:p-12 ${ubuntu.className}`}>
      <div className="max-w-6xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">Katalog Fitur WebGIS</h1>
          <p className="text-slate-500 max-w-2xl mx-auto italic">
            Klik pada alur diagram di bawah untuk mengeksplorasi modul sistem.
          </p>
        </header>

        {/* Interactive Flow Diagram */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12 overflow-x-auto py-4 no-scrollbar">
          {features.map((f, idx) => (
            <React.Fragment key={f.id}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveIdx(idx)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all ${
                  activeIdx === idx 
                  ? `${f.color} border-transparent text-white shadow-xl` 
                  : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                {f.icon}
                <span className="font-medium whitespace-nowrap">{f.title}</span>
              </motion.button>
              {idx < features.length - 1 && (
                <ChevronRight className="hidden lg:block text-slate-300" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content Showcase */}
        <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100">
          
          <div className={`relative p-12 flex flex-col justify-center items-center text-white transition-colors duration-500 ${features[activeIdx].color}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center z-10"
              >
                <div className="bg-white/20 p-8 rounded-full mb-6 backdrop-blur-md inline-block shadow-inner">
                  {React.cloneElement(features[activeIdx].icon, { size: 70, strokeWidth: 1.5 })}
                </div>
                <p className="text-lg font-medium text-white/90">Preview Fitur</p>
                <p className="text-sm font-light text-white/70 max-w-[250px] mx-auto mt-2">
                  {features[activeIdx].imageDesc}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>

          <div className="p-10 md:p-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className={`w-12 h-1 mb-6 rounded-full ${features[activeIdx].color}`} />
                <h2 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-tight">
                  {features[activeIdx].title}
                </h2>
                <div className="space-y-4">
                  {features[activeIdx].details.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-hover hover:bg-white hover:shadow-md">
                      <div className={`w-2 h-2 rounded-full ${features[activeIdx].color}`} />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}