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

interface HerdPlanProps {
  herdId: string | number;
  originPasture: string;
  daysUntilMove: number;
  targetPasture: string;
}

interface LayerControllerProps {
  layer: string;
  setLayer: (layer: string) => void;
  selectedPasture: PastureProps;
  setSelectedPasture: (pasture: PastureProps) => void;
}

const BRAND_COLORS = {
  navy: '#0B2341',
  accent: '#6BA539',
  secondary: '#355E3B',
  graphite: '#2B2F36',
  white: '#F5F7F4',
  border: '#D8DEE3',
};

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
    case 'available': return BRAND_COLORS.accent;
    case 'resting': return BRAND_COLORS.secondary;
    case 'depleted': return BRAND_COLORS.navy;
    default: return BRAND_COLORS.graphite;
  }
}

function getIntensityColor(intensity: number): string {
  if (intensity > 0.8) return BRAND_COLORS.secondary;
  if (intensity > 0.6) return BRAND_COLORS.accent;
  if (intensity > 0.4) return BRAND_COLORS.navy;
  if (intensity > 0.2) return BRAND_COLORS.graphite;
  return BRAND_COLORS.border;
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
            fillColor: feature ? getStatusColor((feature.properties as PastureProps).status) : BRAND_COLORS.graphite,
            fillOpacity: 0.5,
            color: BRAND_COLORS.white,
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

export default function MapDemoReact({ herdPlan }: { herdPlan?: HerdPlanProps } = {}) {
  const [layer, setLayer] = useState('dark');
  const [selectedPasture, setSelectedPasture] = useState<PastureProps>(pasturePolygons.features[0].properties as PastureProps);
  const [mounted, setMounted] = useState(false);

  const plan = herdPlan ?? {
    herdId: '#1',
    originPasture: 'Potrero #9',
    daysUntilMove: 3,
    targetPasture: 'Potrero #12',
  };

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
              ? 'bg-aristeus-green text-text-inverse' 
              : 'glass text-text-secondary hover:text-text-primary'
          }`}
        >
          Vista Aerea
        </button>
        <button
          onClick={() => setLayer('biomass')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            layer === 'biomass' 
              ? 'bg-aristeus-green text-text-inverse' 
              : 'glass text-text-secondary hover:text-text-primary'
          }`}
        >
          Biomasa
        </button>
        <button
          onClick={() => setLayer('plan')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            layer === 'plan' 
              ? 'bg-aristeus-green text-text-inverse' 
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
                  selectedPasture.biomass > 2000 ? 'bg-aristeus-green' : 
                  selectedPasture.biomass > 1000 ? 'bg-aristeus-secondary' : 'bg-aristeus-navy'
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

      {/* Herd planning card */}
      <div className="mt-6 glass rounded-2xl p-6">
        <h3 className="font-heading font-semibold text-text-primary mb-4">Planificación de movimiento</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-text-secondary text-sm">Hato</p>
            <p className="font-data text-xl text-aristeus-green font-semibold">{plan.herdId}</p>
          </div>
          <div>
            <p className="text-text-secondary text-sm">Potrero origen</p>
            <p className="font-heading text-lg text-text-primary">{plan.originPasture}</p>
          </div>
          <div>
            <p className="text-text-secondary text-sm">En</p>
            <p className="font-data text-xl text-aristeus-green font-semibold">{plan.daysUntilMove} días</p>
          </div>
          <div>
            <p className="text-text-secondary text-sm">Potrero destino</p>
            <p className="font-heading text-lg text-text-primary">{plan.targetPasture}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
