import React, { useEffect, useState } from 'react';
import { Globe2, ShieldAlert, Terminal, Layers, Search, ArrowUpRight, Crosshair } from 'lucide-react';

interface GlobalMapViewProps {
  onSelectCountry: (countryCode: string) => void;
  onSelectAsset: (ipOrId: string) => void;
}

export const GlobalMapView: React.FC<GlobalMapViewProps> = ({
  onSelectCountry,
  onSelectAsset
}) => {
  const [mapData, setMapData] = useState<{ assets: any[]; clusters: any[]; telemetry: any } | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/map-data')
      .then(res => res.json())
      .then(data => {
        setMapData(data);
        if (data.clusters?.length > 0) {
          setSelectedCluster(data.clusters[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Convert lat/lng to approximate SVG 2D mercator x, y coordinates
  const projectCoordinates = (lat: number, lng: number) => {
    // Mercator projection bounding box
    const x = ((lng + 180) / 360) * 800;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 250 - (mercN / Math.PI) * 200;
    return { x: Math.max(10, Math.min(790, x)), y: Math.max(10, Math.min(490, y)) };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>GEO-SPATIAL ATTACK SURFACE INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Global Threat Map
          </h1>
          <p className="text-sm text-neutral-400 font-mono">
            Interactive geographical distribution of Internet-facing assets, regional risk clusters, and vulnerable service concentrations.
          </p>
        </div>

        {mapData && (
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 bg-neutral-950 p-3 rounded-xl border border-white/10">
            <div>Scanning Nodes: <strong className="text-white">{mapData.telemetry.activeScanningNodes}</strong></div>
            <div>Sweep: <strong className="text-white">{mapData.telemetry.lastGlobalSweep}</strong></div>
          </div>
        )}
      </div>

      {/* Map SVG Stage */}
      <div className="relative rounded-2xl bg-neutral-950 border border-white/15 overflow-hidden shadow-2xl p-4">
        
        {/* World Map SVG Projection */}
        <div className="relative w-full aspect-[16/9] min-h-[420px] bg-[#050505] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
          
          {/* Cyber Grid background */}
          <div className="absolute inset-0 bg-cyber-grid opacity-35 pointer-events-none" />

          <svg 
            viewBox="0 0 800 500" 
            className="w-full h-full select-none"
          >
            {/* Latitude / Longitude Guide Lines */}
            <line x1="0" y1="250" x2="800" y2="250" stroke="#ffffff" strokeOpacity="0.08" strokeDasharray="3 3" />
            <line x1="400" y1="0" x2="400" y2="500" stroke="#ffffff" strokeOpacity="0.08" strokeDasharray="3 3" />

            {/* Continents Abstract Dot Mesh */}
            {/* North America */}
            <circle cx="210" cy="180" r="45" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            <circle cx="200" cy="190" r="85" fill="none" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
            {/* Europe */}
            <circle cx="430" cy="170" r="35" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            {/* Asia */}
            <circle cx="580" cy="200" r="70" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            {/* South America */}
            <circle cx="290" cy="340" r="35" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            {/* Australia */}
            <circle cx="680" cy="380" r="35" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />

            {/* Clusters Radar Rings */}
            {mapData?.clusters.map((cluster, idx) => {
              const pos = projectCoordinates(cluster.lat, cluster.lng);
              const isSelected = selectedCluster?.code === cluster.code;
              return (
                <g 
                  key={`cluster-${cluster.code}-${idx}`}
                  className="cursor-pointer transition-transform"
                  onClick={() => setSelectedCluster(cluster)}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 18 : 12}
                    fill="#ffffff"
                    fillOpacity={isSelected ? 0.25 : 0.1}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 1.5 : 0.8}
                    strokeOpacity={isSelected ? 0.9 : 0.4}
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 6 : 4}
                    fill="#ffffff"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 12}
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                    opacity={isSelected ? 1 : 0.7}
                  >
                    {cluster.code}
                  </text>
                </g>
              );
            })}

            {/* Verified Host Asset Pins */}
            {mapData?.assets.map((asset, idx) => {
              const pos = projectCoordinates(asset.lat, asset.lng);
              return (
                <g 
                  key={`map-asset-${asset.id}-${idx}`} 
                  className="cursor-pointer group"
                  onClick={() => onSelectAsset(asset.ip)}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={3}
                    fill={asset.riskScore > 75 ? '#ffffff' : '#a3a3a3'}
                    className="hover:scale-150 transition-transform"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Cluster Floating Telemetry Overlay */}
          {selectedCluster && (
            <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-neutral-950/90 border border-white/20 backdrop-blur-xl font-mono text-xs max-w-xs space-y-2 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white text-sm">
                  {selectedCluster.country} ({selectedCluster.code})
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-black font-extrabold text-[10px]">
                  THREAT INDEX {selectedCluster.threatIndex}/100
                </span>
              </div>
              <div className="space-y-1 text-neutral-300">
                <div>Exposed Asset Volume: <strong className="text-white">{(selectedCluster.assetCount / 1000000).toFixed(1)}M</strong></div>
                <div>Primary ASN Route: <strong className="text-neutral-200">{selectedCluster.topAsn}</strong></div>
              </div>
              <button
                onClick={() => onSelectCountry(selectedCluster.code)}
                className="w-full mt-2 py-1.5 rounded bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Search {selectedCluster.code} Hosts</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
