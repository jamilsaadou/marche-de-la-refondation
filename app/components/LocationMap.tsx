"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const locations = [
  {
    name: "Site N°1 - Ex-OPVN (Petit marché)",
    position: [13.514167, 2.108889] as [number, number],
    superficie: "2 600 m²",
    capacite: "412 kiosques",
    localisation: "Rond-point Maourey",
    color: "#3b82f6"
  },
  {
    name: "Site N°2 - Ex-Marché Djémadjé",
    position: [13.515833, 2.107778] as [number, number],
    superficie: "5 500 m²",
    capacite: "642 kiosques",
    localisation: "Près du Ministère du Commerce",
    color: "#10b981"
  }
];

interface VendorLocation {
  name: string;
  location: string;
  site: string;
  kiosk: string;
  phone: string;
  coordinates: [number, number];
}

interface LocationMapProps {
  highlightedVendor?: VendorLocation;
}

export default function LocationMap({ highlightedVendor }: LocationMapProps) {
  const [isClient, setIsClient] = useState(false);
  const center: [number, number] = highlightedVendor 
    ? highlightedVendor.coordinates 
    : [13.515, 2.108333];

  useEffect(() => {
    setIsClient(true);
    
    // Fix default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[350px] md:h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
      <MapContainer
        center={center}
        zoom={highlightedVendor ? 17 : 16}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {highlightedVendor ? (
          <Marker position={highlightedVendor.coordinates}>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2 text-red-600">
                  {highlightedVendor.name}
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Site:</strong> {highlightedVendor.location}</p>
                  <p><strong>Kiosque:</strong> {highlightedVendor.kiosk}</p>
                  <p><strong>Téléphone:</strong> {highlightedVendor.phone}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ) : (
          locations.map((location, index) => (
            <Marker
              key={index}
              position={location.position}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2" style={{ color: location.color }}>
                    {location.name}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Superficie:</strong> {location.superficie}</p>
                    <p><strong>Capacité:</strong> {location.capacite}</p>
                    <p><strong>Localisation:</strong> {location.localisation}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
}
