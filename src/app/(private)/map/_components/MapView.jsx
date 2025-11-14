"use client";
import "../../../../libs/leaflet-setup";
import { MapContainer, TileLayer } from "react-leaflet";
import CityMarkersLayer from "./CityMarkersLayer";

export default function MapView({ center, zoom = 4, points, onMarkerClick }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom
      preferCanvas
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CityMarkersLayer points={points} onMarkerClick={onMarkerClick} />
    </MapContainer>
  );
}
