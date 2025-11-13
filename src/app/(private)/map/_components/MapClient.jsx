// src/app/(private)/map/_components/MapClient.jsx  (CLIENT)
"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CitySidePanel from "./CitySidePanel";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function MapClient({ points }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div className="absolute inset-0">
        <MapView
          center={[56.1304, -106.3468]}
          zoom={4}
          points={points}
          onMarkerClick={setSelected}
        />
      </div>
      <CitySidePanel
        city={selected}
        onClose={() => setSelected(null)}
        onOpenCity={() => {
          if (!selected) return;
          const q = selected.province ? `?province=${encodeURIComponent(selected.province)}` : "";
          router.push(`/city/${encodeURIComponent(selected.city)}${q}`);
        }}
      />
    </>
  );
}
