import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Circle, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import type { FeatureCollection, Feature, Polygon } from 'geojson';
import 'leaflet/dist/leaflet.css';

interface PastureProps {
  name: string;
  status: 'available' | 'resting' | 'depleted';
  biomass: number;
  size: number;
}

interface BiomassPoint {
  center: LatLngExpression;
  radius: number;
  intensity: number;
}

interface LayerControllerProps {
  layer: string;
  setLayer: (layer: string) => void;
  selectedPasture: PastureProps;
  setSelectedPasture: (pasture: PastureProps) => void;
}

// Estancia rural al norte de Santa Cruz, Bolivia (zona de potreros)
const CENTER = [-17.42, -63.28];
const ZOOM = 14;

// Mock pasture data - polígonos irregulares tipo potrero real
const pasturePolygons: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Potrero El Encanto", status: "available", biomass: 2450, size: 85 },
      geometry: {
        type: "Polygon",
        coordinates: [[[-63.30, -17.40], [-63.27, -17.405], [-63.265, -17.42], [-63.28, -17.435], [-63.305, -17.425], [-63.30, -17.40]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Potrero La Esperanza", status: "resting", biomass: 1200, size: 62 },
      geometry: {
        type: "Polygon",
        coordinates: [[[-63.26, -17.405], [-63.24, -17.41], [-63.235, -17.425], [-63.25, -17.44], [-63.27, -17.43], [-63.26, -17.405]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Potrero San Juan", status: "depleted", biomass: 400, size: 78 },
      geometry: {
        type: "Polygon",
        coordinates: [[[-63.29, -17.43], [-63.275, -17.435], [-63.27, -17.45], [-63.285, -17.46], [-63.30, -17.445], [-63.29, -17.43]]]
      }
    }
  ]
};

const biomassHeatmap: BiomassPoint[] = [
  { center: [-17.415, -63.285], radius: 1200, intensity: 0.9 },
  { center: [-17.425, -63.26], radius: 900, intensity: 0.7 },
  { center: [-17.445, -63.275], radius: 1000, intensity: 0.8 },
  { center: [-17.41, -63.265], radius: 700, intensity: 0.5 },
  { center: [-17.435, -63.295], radius: 600, intensity: 0.3 },
];

function getStatusColor(status: PastureProps['status']): string {
  switch (status) {
    case 'available': return '#1B7A2B';
    case 'resting': return '#B8963E';
    case 'depleted': return '#DC2626';
    default: return '#30363D';
  }
}

function getIntensityColor(intensity: number): string {
  if (intensity > 0.8) return '#1B7A2B';
  if (intensity > 0.6) return '#4CAF50';
  if (intensity > 0.4) return '#7AB929';
  if (intensity > 0.2) return '#D97706';
  return '#DC2626';
}

function LayerController({ layer, setLayer, selectedPasture, setSelectedPasture }: LayerControllerProps) {
  const map = useMap();
  
  const tiles = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  };

  return (
    <>
      {/* Base layer toggle */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={layer === 'satellite' ? tiles.satellite : tiles.dark}
      />
      
      {/* Biomass heatmap layer */}
      {layer === 'biomass' && biomassHeatmap.map((point, idx) => (
        <Circle
          key={idx}
          center={point.center}
          radius={point.radius}
          fillColor={getIntensityColor(point.intensity)}
          fillOpacity={0.5}
          stroke={false}
        />
      ))}
      
      {/* Pasture plan layer */}
      {(layer === 'plan' || layer === 'satellite') && (
        <GeoJSON
          data={pasturePolygons}
          style={(feature) => ({
            fillColor: feature ? getStatusColor((feature.properties as PastureProps).status) : '#30363D',
            fillOpacity: 0.5,
            color: '#fff',
            weight: 2
          })}
          onEachFeature={(feature, layer) => {
            layer.on({
              click: () => setSelectedPasture(feature.properties)
            });
          }}
        />
      )}
    </>
  );
}

export default function MapDemoReact() {
  const [layer, setLayer] = useState('dark');
  const [selectedPasture, setSelectedPasture] = useState<PastureProps>(pasturePolygons.features[0].properties as PastureProps);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="glass rounded-2xl p-6 aspect-[16/9] max-w-5xl mx-auto flex items-center justify-center">
        <p className="text-text-secondary">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Layer controls */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => setLayer('dark')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            layer === 'dark' 
              ? 'bg-aristeus-green text-bg-primary' 
              : 'glass text-text-secondary hover:text-text-primary'
          }`}
        >
          Vista Satelital
        </button>
        <button
          onClick={() => setLayer('biomass')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            layer === 'biomass' 
              ? 'bg-aristeus-green text-bg-primary' 
              : 'glass text-text-secondary hover:text-text-primary'
          }`}
        >
          Biomasa
        </button>
        <button
          onClick={() => setLayer('plan')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            layer === 'plan' 
              ? 'bg-aristeus-green text-bg-primary' 
              : 'glass text-text-secondary hover:text-text-primary'
          }`}
        >
          Plan Pastoreo
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 glass rounded-2xl p-2 overflow-hidden">
          <div className="aspect-[16/9] rounded-xl overflow-hidden">
            <MapContainer
              center={CENTER as LatLngExpression}
              zoom={ZOOM}
              style={{ width: '100%', height: '100%' }}
            >
              <LayerController 
                layer={layer} 
                setLayer={setLayer}
                selectedPasture={selectedPasture}
                setSelectedPasture={setSelectedPasture}
              />
            </MapContainer>
          </div>
        </div>

        {/* Info panel */}
        <div className="glass rounded-2xl p-6 lg:col-span-1">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Datos del potrero</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-text-secondary text-sm">Potrero seleccionado</p>
              <p className="font-heading text-lg text-text-primary">{selectedPasture.name}</p>
              <p className="text-text-secondary text-sm">{selectedPasture.size} ha</p>
            </div>
            
            <div>
              <p className="text-text-secondary text-sm">Biomasa estimada</p>
              <p className="font-data text-xl text-aristeus-green font-semibold">
                {selectedPasture.biomass.toLocaleString()} kg MS/ha
              </p>
            </div>
            
            <div>
              <p className="text-text-secondary text-sm">Estado nutricional</p>
              <p className="flex items-center gap-2 text-text-primary">
                <span className={`w-2 h-2 rounded-full ${
                  selectedPasture.biomass > 2000 ? 'bg-green-500' : 
                  selectedPasture.biomass > 1000 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                {selectedPasture.biomass > 2000 ? 'Alto' : 
                 selectedPasture.biomass > 1000 ? 'Medio' : 'Bajo'}
              </p>
            </div>
            
            <div className="pt-4 border-t border-border-subtle">
              <p className="text-text-secondary text-sm mb-2">Recomendación</p>
              <p className="text-text-primary text-sm">
                {selectedPasture.status === 'available' 
                  ? `Listo para pastoreo — ${Math.floor(selectedPasture.biomass / 20)} cabezas x ${Math.floor(selectedPasture.biomass / 300)} días`
                  : selectedPasture.status === 'resting'
                  ? 'En descanso — Esperar 15 días'
                  : 'Agotado — No pastorear'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
