"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import MapGL, { Source, Layer, NavigationControl, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import * as turf from "@turf/turf";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const MapView = () => {
  const [viewport, setViewport] = useState({
    latitude: -7.0,
    longitude: 110.0,
    zoom: 7,
  });

  // Data States
  const [jawaHealthcareData, setJawaHealthcareData] = useState<any>(null);
  const [jawaIndustrialData, setJawaIndustrialData] = useState<any>(null);
  
  // UI States
  const [showHC, setShowHC] = useState(true); // Toggle Layer
  const [showInd, setShowInd] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<any>(null); // Popup/Info
  const [searchQuery, setSearchQuery] = useState("");
  const [bufferList, setBufferList] = useState<any[]>([]); // Fitur Analisis
  
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<any>(null);
  const hasFetched = useRef(false);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [hcRes, indRes] = await Promise.all([
        fetch("/api/jawa_healthcare"),
        fetch("/api/jawa_industrial")
      ]);

      const hcRaw = await hcRes.json();
      const indRaw = await indRes.json();

      const extractFeatures = (raw: any) => {
        if (!raw) return [];
        const doc = Array.isArray(raw) ? raw[0] : raw;
        return doc?.features || [];
      };

      const hcFeatures = extractFeatures(hcRaw);
      const indFeatures = extractFeatures(indRaw);

      setJawaHealthcareData({ type: "FeatureCollection", features: hcFeatures });
      setJawaIndustrialData({ type: "FeatureCollection", features: indFeatures });

      // Auto Zoom
      const allFeatures = [...hcFeatures, ...indFeatures].filter(f => f?.geometry);
      if (allFeatures.length > 0) {
        const bbox = turf.bbox(turf.featureCollection(allFeatures));
        mapRef.current?.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 50 });
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAllData();
      hasFetched.current = true;
    }
  }, [fetchAllData]);

    // FITUR: Pencarian Sederhana (Filter Client-side)
    const handleSearch = () => {
      const feature = jawaHealthcareData?.features.find((f: any) => 
        f.properties?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (feature && feature.geometry.type === "Point") {
        setViewport({
          ...viewport,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          zoom: 14
        });
      }
    };

    // Fungsi Klik Peta untuk menambah Buffer (Maksimal 5)
    const onMapClick = (event: any) => {
      if (bufferList.length >= 5) {
        alert("Maksimal 5 radius. Hapus salah satu untuk menambah baru.");
        return;
      }
    const { lngLat } = event;
    const point = turf.point([lngLat.lng, lngLat.lat]);
    const buffered = turf.buffer(point, 5, { units: 'kilometers' });

    // Berikan ID unik menggunakan timestamp agar bisa dihapus spesifik
    const newBuffer = {
      id: Date.now(),
      data: buffered,
      center: [lngLat.lng, lngLat.lat]
    };

      setBufferList([...bufferList, newBuffer]);
    };

    // Fungsi untuk menghapus satu buffer tertentu
    const removeBuffer = (id: number) => {
      setBufferList(bufferList.filter(b => b.id !== id));
    };

  return (
    <div className="w-full h-screen relative font-sans">
      {/* Search Bar */}
      <div className="absolute top-5 left-5 z-50 flex gap-2">
        <input 
          className="p-2 rounded border shadow-lg w-64 text-sm"
          placeholder="Cari nama lokasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-1 rounded shadow text-sm">Cari</button>
      </div>

      {/* Layer Control Panel & Legend */}
      <div className="absolute top-20 left-5 z-50 bg-white p-4 rounded shadow-lg w-52 text-xs border border-gray-200">
        <h3 className="font-bold mb-3 text-sm border-b pb-1">Layer & Legenda</h3>
        <div className="flex flex-col gap-3">
          {/* Healthcare Legend Item */}
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 accent-[#00ddff]" checked={showHC} onChange={() => setShowHC(!showHC)} />
              <span className="group-hover:text-blue-600 transition-colors">Healthcare</span>
            </div>
            <div 
              className="w-8 h-3 rounded-sm border border-black/20" 
              style={{ backgroundColor: "#00ddff", opacity: 0.6 }}
            />
          </label>

          {/* Industrial Legend Item */}
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 accent-[#ffa600]" checked={showInd} onChange={() => setShowInd(!showInd)} />
              <span className="group-hover:text-orange-600 transition-colors">Industrial</span>
            </div>
            <div className="w-8 h-3 rounded-sm border border-black/20" style={{ backgroundColor: "#ffa600", opacity: 0.6 }} />
          </label>
        </div> {/* Penutup flex-col gap-3 */}

        {/* Analisis Radius Section */}
        <div className="mt-4 pt-2 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-[10px] uppercase text-gray-500">
              Analisis Radius ({bufferList.length}/5)
            </span>
            {bufferList.length > 0 && (
              <button onClick={() => setBufferList([])} className="text-[10px] text-red-600 hover:underline">
                Hapus Semua
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {bufferList.length === 0 && (
              <p className="text-[10px] text-gray-400 italic text-center py-2">Klik peta untuk buat radius</p>
            )}
            {bufferList.map((buffer, index) => (
              <div key={buffer.id} className="flex items-center justify-between bg-gray-50 p-1.5 rounded border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px]">Radius {index + 1}</span>
                </div>
                <button onClick={() => removeBuffer(buffer.id)} className="text-gray-400 hover:text-red-500 font-bold px-1">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div> {/* Penutup Panel Utama */}





      <MapGL
        {...viewport}
        
        ref={mapRef}
        onMove={evt => setViewport(evt.viewState)}
        onClick={onMapClick}
        interactiveLayerIds={['hc-layer', 'ind-layer']}
        onMouseMove={e => {
          const feature = e.features?.[0];
          if (feature) {
            setHoverInfo({
              lngLat: e.lngLat,
              props: feature.properties // Ini akan mengambil name, website, luas_ha dari MongoDB
            });
          } else {
            setHoverInfo(null);
          }
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
      >
        <NavigationControl position="top-right" />

        {/* Fitur Analisis: Layer Buffer */}
        {bufferList.map((buffer) => (
            <Source key={buffer.id} id={`buffer-source-${buffer.id}`} type="geojson" data={buffer.data}>
              <Layer
                id={`buffer-layer-${buffer.id}`}
                type="fill"
                paint={{ 
                  "fill-color": "#ff0000", 
                  "fill-opacity": 0.15,
                  "fill-outline-color": "#ff0000" 
                }}
              />
            </Source>
          ))}

        {/* Data Layers */}
        {showHC && jawaHealthcareData && (
          <Source id="hc-source" type="geojson" data={jawaHealthcareData}>
            <Layer
              id="hc-layer"
              type="fill"
              paint={{ "fill-color": "#00ddff", "fill-opacity": 0.6 }}
            />
          </Source>
        )}

        {showInd && jawaIndustrialData && (
          <Source id="ind-source" type="geojson" data={jawaIndustrialData}>
            <Layer
              id="ind-layer"
              type="fill"
              paint={{ "fill-color": "#ffa600", "fill-opacity": 0.6 }}
            />
          </Source>
        )}

        {/* Fitur: Popup Information */}
        {/* Fitur: Popup Information Detail */}
        {hoverInfo && (
          <Popup
            longitude={hoverInfo.lngLat.lng}
            latitude={hoverInfo.lngLat.lat}
            closeButton={false}
            className="z-50"
          >
            <div className="p-2 min-w-[150px] text-sm font-sans">
              <div className="border-b mb-2 pb-1">
                <h4 className="font-bold text-blue-700">
                  {hoverInfo.props.name || "Tanpa Nama"}
                </h4>
              </div>
              
              <div className="space-y-1 text-xs">
                {/* Menampilkan Luas dalam Hektar */}
                <p className="flex justify-between gap-4">
                  <span className="text-gray-500">Luas:</span>
                  <span className="font-semibold">
                    {hoverInfo.props.luas_ha 
                      ? `${Number(hoverInfo.props.luas_ha).toLocaleString('id-ID')} ha` 
                      : "-"}
                  </span>
                </p>

                {/* Menampilkan Website sebagai Link */}
                <p className="flex flex-col mt-2">
                  <span className="text-gray-500">Website:</span>
                  {hoverInfo.props.website ? (
                    <a 
                      href={hoverInfo.props.website.startsWith('http') ? hoverInfo.props.website : `https://${hoverInfo.props.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 underline truncate hover:text-blue-700"
                    >
                      {hoverInfo.props.website}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Tidak tersedia</span>
                  )}
                </p>
              </div>
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Info Panel */}
      <div className="absolute bottom-10 left-10 bg-white/90 p-4 rounded shadow-xl z-50 text-[11px]">
        <h3 className="font-bold border-b mb-1">Statistik Regional</h3>
        <p>Total Healthcare: {jawaHealthcareData?.features?.length || 0}</p>
        <p>Total Industrial: {jawaIndustrialData?.features?.length || 0}</p>
        <p className="text-gray-500 mt-2 italic">* OSM data</p>
      </div>
    </div>
  );
};

export default MapView;