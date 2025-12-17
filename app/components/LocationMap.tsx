"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt, FaStore, FaRuler, FaCubes, FaInfoCircle, FaPhone, FaEnvelope } from 'react-icons/fa';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const locations = [
  {
    id: 1,
    name: "Site N°1 - Ex-OPVN",
    subtitle: "Petit marché",
    position: [13.514167, 2.108889] as [number, number],
    superficie: "2 600 m²",
    capacite: "412 kiosques",
    localisation: "Rond-point Maourey",
    color: "#3b82f6",
    description: "Site moderne avec infrastructure complète",
    amenities: ["Parking", "Sécurité 24/7", "Électricité", "Eau courante"],
    contact: {
      phone: "+227 XX XX XX XX",
      email: "site1@marche-refondation.ne"
    }
  },
  {
    id: 2,
    name: "Site N°2 - Ex-Marché Djémadjé",
    subtitle: "Grand marché",
    position: [13.515833, 2.107778] as [number, number],
    superficie: "5 500 m²",
    capacite: "642 kiosques",
    localisation: "Près du Ministère du Commerce",
    color: "#10b981",
    description: "Le plus grand site avec capacité étendue",
    amenities: ["Parking VIP", "Sécurité 24/7", "Zone de stockage", "Restaurant"],
    contact: {
      phone: "+227 XX XX XX XX",
      email: "site2@marche-refondation.ne"
    }
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
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const center: [number, number] = highlightedVendor 
    ? highlightedVendor.coordinates 
    : [13.515, 2.108333];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create custom icons for each site
  const createCustomIcon = (color: string, isSelected: boolean = false) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${isSelected ? '40px' : '32px'};
          height: ${isSelected ? '40px' : '32px'};
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          border: 3px solid white;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: ${isSelected ? '20px' : '16px'};
            font-weight: bold;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
      iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32],
      popupAnchor: [0, isSelected ? -40 : -32]
    });
  };

  if (!isClient) {
    return (
      <div className="w-full h-[450px] md:h-[500px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Map Container with Enhanced Styling */}
      <div className="w-full h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50 backdrop-blur-sm">
        <MapContainer
          center={center}
          zoom={highlightedVendor ? 17 : 15.5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="brightness-110 contrast-125"
          />
          
          {/* Connection Line between sites */}
          {!highlightedVendor && (
            <Polyline 
              positions={locations.map(l => l.position)}
              color="#a855f7"
              weight={3}
              opacity={0.6}
              dashArray="10, 10"
            />
          )}
          
          {/* Site Circles for better visibility */}
          {!highlightedVendor && locations.map((location, index) => (
            <Circle
              key={`circle-${index}`}
              center={location.position}
              radius={150}
              pathOptions={{
                fillColor: location.color,
                fillOpacity: 0.15,
                color: location.color,
                weight: 2,
                opacity: 0.5
              }}
            />
          ))}
          
          {highlightedVendor ? (
            <>
              <Circle
                center={highlightedVendor.coordinates}
                radius={50}
                pathOptions={{
                  fillColor: '#ef4444',
                  fillOpacity: 0.3,
                  color: '#ef4444',
                  weight: 3,
                  opacity: 0.8
                }}
              />
              <Marker 
                position={highlightedVendor.coordinates}
                icon={createCustomIcon('#ef4444', true)}
              >
                <Popup className="custom-popup">
                  <div className="p-4 min-w-[280px]">
                    <div className="border-b pb-3 mb-3">
                      <h3 className="font-bold text-xl text-red-600 mb-1">
                        {highlightedVendor.name}
                      </h3>
                      <p className="text-sm text-gray-600">Vendeur vérifié</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span><strong>Site:</strong> {highlightedVendor.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FaStore className="text-blue-500" />
                        <span><strong>Kiosque:</strong> {highlightedVendor.kiosk}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FaPhone className="text-green-500" />
                        <span><strong>Téléphone:</strong> {highlightedVendor.phone}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </>
          ) : (
            locations.map((location, index) => (
              <Marker
                key={index}
                position={location.position}
                icon={createCustomIcon(location.color, selectedLocation === location.id)}
                eventHandlers={{
                  click: () => setSelectedLocation(location.id),
                  popupclose: () => setSelectedLocation(null)
                }}
              >
                <Popup className="custom-popup" maxWidth={350}>
                  <div className="p-4 min-w-[320px]">
                    {/* Header */}
                    <div className="border-b pb-3 mb-4">
                      <h3 className="font-bold text-xl mb-1" style={{ color: location.color }}>
                        {location.name}
                      </h3>
                      <p className="text-sm text-gray-600">{location.subtitle}</p>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-4 italic">{location.description}</p>
                    
                    {/* Main Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                          <FaRuler />
                          <span>Superficie</span>
                        </div>
                        <p className="font-semibold text-sm">{location.superficie}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                          <FaCubes />
                          <span>Capacité</span>
                        </div>
                        <p className="font-semibold text-sm">{location.capacite}</p>
                      </div>
                    </div>
                    
                    {/* Localisation */}
                    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-primary-600" />
                        <span className="text-sm font-medium">{location.localisation}</span>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Équipements:</p>
                      <div className="flex flex-wrap gap-2">
                        {location.amenities.map((amenity, i) => (
                          <span key={i} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Contact */}
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Contact:</p>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <FaPhone className="text-gray-400" />
                          <span>{location.contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <FaEnvelope className="text-gray-400" />
                          <span>{location.contact.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
      
      {/* Map Legend */}
      {!highlightedVendor && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/50 z-[1000]">
          <p className="text-xs font-semibold text-gray-700 mb-2">Légende:</p>
          <div className="space-y-1">
            {locations.map((loc, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: loc.color }}
                />
                <span className="text-xs text-gray-600">{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
