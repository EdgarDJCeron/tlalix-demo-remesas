import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for cashout points
const cashoutIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0e96ae" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45],
});

type CashoutPoint = {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  hours: string;
  feePct: number;
};

type InteractiveMapProps = {
  cashoutPoints: CashoutPoint[];
  onSelectPoint?: (point: CashoutPoint) => void;
  lang?: 'es' | 'en';
};

export function InteractiveMap({ cashoutPoints, onSelectPoint, lang = 'es' }: InteractiveMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<CashoutPoint | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Center of Mexico City (default center)
  const defaultCenter: [number, number] = [19.4326, -99.1332];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMarkerClick = (point: CashoutPoint) => {
    setSelectedPoint(point);
    onSelectPoint?.(point);
    // Force re-render to center on new point
    setMapKey(prev => prev + 1);
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-[hsl(var(--color-azul-marino))]/50 rounded-lg">
        <div className="text-white/70 text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>{lang === 'es' ? 'Cargando mapa...' : 'Loading map...'}</p>
        </div>
      </div>
    );
  }

  const center = selectedPoint ? [selectedPoint.lat, selectedPoint.lng] as [number, number] : defaultCenter;

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-white/10">
      <MapContainer
        key={mapKey}
        center={center}
        zoom={selectedPoint ? 15 : 6}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers for each cashout point */}
        {cashoutPoints.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={cashoutIcon}
            eventHandlers={{
              click: () => handleMarkerClick(point),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1 text-[hsl(var(--color-celeste))]">
                  {point.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{point.city}</p>
                <p className="text-xs text-gray-500 mb-2">{point.address}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {point.hours}
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lang === 'es' ? 'Comisión:' : 'Fee:'} {(point.feePct * 100).toFixed(1)}%
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Selected point info overlay */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] border border-white/20 md:left-auto md:w-80">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-[hsl(var(--color-azul-marino))]">
              {selectedPoint.name}
            </h3>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-1">{selectedPoint.city}</p>
          <p className="text-xs text-gray-500 mb-3">{selectedPoint.address}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{selectedPoint.hours}</span>
            <span className="font-semibold text-green-600">
              {(selectedPoint.feePct * 100).toFixed(1)}% {lang === 'es' ? 'comisión' : 'fee'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
