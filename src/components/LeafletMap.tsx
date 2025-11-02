import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CashoutPoint } from '@/mocks/cashout';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icono personalizado para puntos de retiro
const createCustomIcon = (isSelected: boolean) => {
  const html = `
    <div style="
      width: ${isSelected ? '48px' : '40px'}; 
      height: ${isSelected ? '48px' : '40px'}; 
      background: ${isSelected ? '#a3e635' : '#0e96ae'}; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 3px solid white;
      transition: all 0.3s ease;
    ">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>
  `;
  
  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [isSelected ? 48 : 40, isSelected ? 48 : 40],
    iconAnchor: [isSelected ? 24 : 20, isSelected ? 48 : 40],
  });
};

interface LeafletMapProps {
  points: CashoutPoint[];
  selectedPoint: CashoutPoint | null;
  onSelectPoint: (point: CashoutPoint) => void;
}

export const LeafletMap = ({ points, selectedPoint, onSelectPoint }: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Crear el mapa centrado en México
    const map = L.map(containerRef.current, {
      center: [23.6345, -102.5528], // Centro de México
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapRef.current = map;

    // Añadir capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Añadir marcadores
    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createCustomIcon(false),
      }).addTo(map);

      // Popup con información
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: #1e293b;">${point.name}</h3>
          <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">${point.city}</p>
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">${point.address}</p>
          <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #e2e8f0;">
            <span style="font-size: 12px; color: #64748b;">⏰ ${point.hours}</span>
            <span style="font-size: 12px; font-weight: 600; color: #10b981;">💰 ${(point.feePct * 100).toFixed(1)}%</span>
          </div>
        </div>
      `);

      // Click event
      marker.on('click', () => {
        onSelectPoint(point);
      });

      markersRef.current[point.id] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [points]); // Solo se ejecuta una vez con los puntos iniciales

  // Actualizar iconos cuando cambia la selección
  useEffect(() => {
    if (!mapRef.current) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isSelected = selectedPoint?.id === id;
      marker.setIcon(createCustomIcon(isSelected));
      
      if (isSelected && selectedPoint) {
        // Hacer zoom al punto seleccionado
        mapRef.current?.setView([selectedPoint.lat, selectedPoint.lng], 12, {
          animate: true,
        });
        marker.openPopup();
      }
    });
  }, [selectedPoint]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-lg" 
      style={{ minHeight: '500px' }}
    />
  );
};
