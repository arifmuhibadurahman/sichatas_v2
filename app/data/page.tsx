"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ubuntu } from 'next/font/google';
import { 
  Database, 
  Globe, 
  Layers, 
  ArrowRight, 
  Cpu, 
  DownloadCloud,
  FileCode,
  HardDrive
} from 'lucide-react';

const ubuntu = Ubuntu({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '700'] 
});

const dataSources = [
  {
    id: "osm",
    title: "OpenStreetMap (OSM)",
    type: "Vector Data",
    icon: <Globe className="w-8 h-8" />,
    color: "from-emerald-500 to-teal-600",
    description: "Sumber data crowdsourcing global untuk entitas geografis seperti jalan, bangunan, dan poin minat (POI).",
    details: [
      "Format: .pbf / GeoJSON",
      "Update: Real-time Community Contribution",
      "Cakupan: Seluruh Dunia",
      "Lisensi: ODbL (Open Database License)"
    ],
    techStack: ["Overpass API", "OSM Bright Style"]
  },
  {
    id: "qgis",
    title: "QGIS Raster Analysis",
    type: "Raster Data",
    icon: <Cpu className="w-8 h-8" />,
    color: "from-orange-500 to-red-600",
    description: "Hasil pemrosesan spasial tingkat lanjut menggunakan software QGIS, seperti analisis kelerengan (slope) atau NDVI.",
    details: [
      "Format: GeoTIFF (.tif)",
      "Metode: Interpolasi & Reclass",
      "Resolusi: Menyesuaikan Data Input",
      "Output: Heatmap / Interpolasi IDW"
    ],
    techStack: ["GDAL Engine", "GRASS GIS", "SAGA"]
  }
];

export default function DataPage() {
  const [selectedSource, setSelectedSource] = useState(dataSources[0]);

  return (
    <div className={`min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 ${ubuntu.className}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4"
          >
            Data Provenance
          </motion.h1>
          <p className="text-slate-400 text-lg">Menelusuri asal-usul dan struktur data yang membangun WebGIS Anda.</p>
        </div>

        {/* Visual Pipeline Diagram */}
        <div className="grid lg:grid-cols-3 gap-8 items-center mb-20">
          
          {/* Source Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Pilih Sumber Data</h3>
            {dataSources.map((source) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source)}
                className={`w-full group relative p-6 rounded-2xl transition-all duration-300 text-left border ${
                  selectedSource.id === source.id 
                  ? `border-transparent bg-gradient-to-br ${source.color} text-white shadow-2xl` 
                  : "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${selectedSource.id === source.id ? 'bg-white/20' : 'bg-slate-700 text-slate-300'}`}>
                    {source.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">{source.title}</h4>
                    <span className={`text-xs uppercase font-bold tracking-tighter ${selectedSource.id === source.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {source.type}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Connection Animation */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-4">
            <div className="w-full h-1 bg-slate-800 relative overflow-hidden rounded-full">
              <motion.div 
                key={selectedSource.id}
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className={`absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent`}
              />
            </div>
            <div className="flex gap-4">
              <Database className="text-slate-700 w-10 h-10 animate-pulse" />
              <ArrowRight className="text-slate-800" />
              <Layers className="text-blue-500 w-10 h-10" />
            </div>
            <span className="text-xs font-mono text-slate-600">ETL PROCESS IN PROGRESS</span>
          </div>

          {/* Details Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSource.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">{selectedSource.title}</h3>
                <DownloadCloud className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
              </div>
              <p className="text-slate-300 mb-8 leading-relaxed">
                {selectedSource.description}
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {selectedSource.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <FileCode className="w-4 h-4 text-emerald-500" />
                    {detail}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-700 flex flex-wrap gap-2">
                {selectedSource.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-slate-900 rounded-full text-[10px] font-bold text-blue-400 border border-blue-900/50">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Info Box */}
        <div className="bg-blue-950/30 border border-blue-900/50 p-6 rounded-2xl flex gap-4 items-start">
          <HardDrive className="text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-200/70 italic">
            Seluruh data raster dienkripsi dan disimpan di server lokal dalam format GeoTIFF yang dioptimalkan untuk tiling (Cloud Optimized GeoTIFF), sedangkan data OSM ditarik melalui API setiap 24 jam untuk memastikan akurasi jalan terbaru.
          </p>
        </div>
      </div>
    </div>
  );
}