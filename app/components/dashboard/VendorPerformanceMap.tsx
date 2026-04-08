"use client";

import { useEffect, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

const farmIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

function RecenterAndFitBounds({
  points,
}: {
  points: { lat: number; lng: number }[];
}) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    const group = L.featureGroup(points.map((p) => L.marker([p.lat, p.lng])));
    map.fitBounds(group.getBounds().pad(0.5));
  }, [points, map]);
  return null;
}

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type MapFarm = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: number;
  shopName: string | null;
  ownerName: string;
  farmStatus: string;
  productCount: number;
};

export default function VendorPerformanceMap() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [farms, setFarms] = useState<MapFarm[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 45.5017,
    lng: -73.5673,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  }, []);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${base}/api/farms/map-markers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.success) {
          setError(data?.message || "Failed to load farm locations");
          setFarms([]);
          return;
        }
        const raw = data.farms || data?.data?.farms || [];
        const mapped: MapFarm[] = raw
          .map((farm: Record<string, unknown>, idx: number) => {
            const lat =
              typeof farm.latitude === "number"
                ? farm.latitude
                : Array.isArray(farm.coordinates)
                  ? (farm.coordinates as number[])[1]
                  : null;
            const lng =
              typeof farm.longitude === "number"
                ? farm.longitude
                : Array.isArray(farm.coordinates)
                  ? (farm.coordinates as number[])[0]
                  : null;
            if (lat == null || lng == null) return null;
            const id = String(farm.farmId ?? farm._id ?? "") || `farm-${idx}`;
            const name =
              (farm.farmName as string) ||
              (farm.name as string) ||
              (farm.description as string) ||
              "Farm";
            return {
              id,
              name,
              lat,
              lng,
              distance: 0,
              shopName: (farm.shopName as string) || null,
              ownerName: (farm.ownerName as string) || "—",
              farmStatus: (farm.farmStatus as string) || "—",
              productCount: Number(farm.productCount) || 0,
            };
          })
          .filter(Boolean) as MapFarm[];
        setFarms(mapped);
      } catch {
        setError("Failed to load farm locations");
        setFarms([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const farmsWithDistance = farms.map((f) => ({
    ...f,
    distance: getDistanceKm(userLocation.lat, userLocation.lng, f.lat, f.lng),
  }));

  const closestFarmId =
    farmsWithDistance.length > 0
      ? farmsWithDistance.reduce(
          (closest, f) => (f.distance < closest.distance ? f : closest),
          farmsWithDistance[0],
        ).id
      : null;

  const allPoints = [
    userLocation,
    ...farmsWithDistance.map((f) => ({ lat: f.lat, lng: f.lng })),
  ];
  const paths: [number, number][][] = farmsWithDistance.map((f) => [
    [userLocation.lat, userLocation.lng],
    [f.lat, f.lng],
  ]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600">
        Loading map…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-center text-sm text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          {farmsWithDistance.length}{" "}
          {farmsWithDistance.length === 1 ? "farm" : "farms"} on map
        </span>
      </div>

      <div className="h-[400px] w-full overflow-hidden rounded-xl border border-emerald-200/60 shadow-inner">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={farmsWithDistance.length > 0 ? 13 : 10}
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />

          {farmsWithDistance.length > 0 && (
            <RecenterAndFitBounds points={allPoints} />
          )}

          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <strong>You</strong> (reference point for distances)
            </Popup>
          </Marker>

          {farmsWithDistance.map((f) => (
            <Marker
              key={f.id}
              position={[f.lat, f.lng]}
              icon={farmIcon}
            >
              <Popup className="farm-popup">
                <div className="min-w-[190px]">
                <div className="font-semibold text-gray-900">{f.name}</div>
                {f.shopName ? (
                  <div className="text-xs text-gray-600">{f.shopName}</div>
                ) : null}
                <div className="mt-1 text-xs text-gray-600">
                  {f.ownerName}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Status: {f.farmStatus}
                  {f.productCount > 0
                    ? ` · ${f.productCount} active listing(s)`
                    : ""}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {f.distance.toFixed(2)} km from reference point
                  {f.id === closestFarmId ? (
                    <span className="ml-1 font-semibold text-green-700">
                      (closest)
                    </span>
                  ) : null}
                </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {paths.map((path, idx) => (
            <Polyline
              key={idx}
              positions={path}
              pathOptions={{
                color: "#2563eb",
                dashArray: "4,8",
                weight: 2.5,
                opacity: 0.4,
              }}
            />
          ))}

          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={2000}
            pathOptions={{ color: "#f59e0b", opacity: 0.45, fillOpacity: 0.07 }}
          />
        </MapContainer>
      </div>

      <div className="mt-3 flex justify-between text-sm">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userIcon.options.iconUrl}
              alt=""
              width={16}
              height={16}
            />
            <span className="text-blue-700">You</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={farmIcon.options.iconUrl}
              alt=""
              width={16}
              height={16}
            />
            <span className="text-rose-700">Farm</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {farmsWithDistance.length} farms visible on map
        </span>
      </div>
    </div>
  );
}
