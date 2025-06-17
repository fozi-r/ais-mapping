// components/VesselClusterLayer.tsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useMap } from 'react-leaflet';
import { Vessel } from '../models/Vessel';
import '../App.css';
import { AISTrackSymbol } from '@arl/leaflet-tracksymbol2';
interface Props {
    vessels: Record<string, Vessel>;
}

const VesselClusterLayer = ({ vessels }: Props) => {
    const map = useMap();

    // These hold currently rendered layers
    const individualRef = useRef<Map<string, AISTrackSymbol>>(new Map());
    const clusterRef = useRef<Map<string, L.Marker>>(new Map());
    const currentVesselIds = new Set(Object.keys(vessels));

    const CLUSTER_RADIUS_METERS = 100;
    const CLUSTER_MIN_SIZE = 5;
    const CLUSTER_DISABLED_ZOOM = 12;

    // Mount: Add individual vessels
    useEffect(() => {
        const individualMap = individualRef.current;

        Object.values(vessels).forEach((vessel) => {
            if (!vessel.aisTrackSymbol) return;
            if (typeof vessel.isVisible === "function" && !vessel.isVisible()) return;
            if (individualMap.has(vessel.id)) return;

            vessel.aisTrackSymbol.addTo(map);
            individualMap.set(vessel.id, vessel.aisTrackSymbol);
        });

        individualMap.forEach((marker, id) => {
            if (!currentVesselIds.has(id)) {
              map.removeLayer(marker);
              individualMap.delete(id);
            }
          });
    }, [vessels, map]);

    // Handle zoom-based clustering
    // useEffect(() => {
    //     const clusterMap = clusterRef.current;

    //     const updateClusters = () => {
    //         const zoom = map.getZoom();
    //         const vesselsArray = Object.values(vessels).filter(
    //             (v): v is Vessel & { aisTrackSymbol: AISTrackSymbol } => !!v.aisTrackSymbol
    //           );
    //         const clustered = new Set<string>();

    //         // Clear old cluster markers
    //         clusterMap.forEach(marker => map.removeLayer(marker));
    //         clusterMap.clear();

    //         // Skip clustering at high zoom
    //         if (zoom >= CLUSTER_DISABLED_ZOOM) return;

    //         for (let i = 0; i < vesselsArray.length; i++) {
    //             const vessel = vesselsArray[i];
    //             if (!vessel.aisTrackSymbol || clustered.has(vessel.id)) continue;

    //             const origin = vessel.aisTrackSymbol.getLatLng();
    //             const nearby = [vessel];

    //             for (let j = i + 1; j < vesselsArray.length; j++) {
    //                 const other = vesselsArray[j];
    //                 if (clustered.has(other.id) || !other.aisTrackSymbol) continue;

    //                 const dest = other.aisTrackSymbol.getLatLng();
    //                 const dist = haversineDistance(origin.lat, origin.lng, dest.lat, dest.lng);
    //                 if (dist <= CLUSTER_RADIUS_METERS) nearby.push(other);
    //             }

    //             if (nearby.length >= CLUSTER_MIN_SIZE) {

    //                 // Hide individual markers in cluster
    //                 nearby.forEach(v => {
    //                     map.removeLayer(v.aisTrackSymbol)
    //                     clustered.add(v.id);
    //                 });

    //                 // Create cluster marker at centroid
    //                 const avgLat = nearby.reduce((sum, v) => sum + v.aisTrackSymbol.getLatLng().lat, 0) / nearby.length;
    //                 const avgLon = nearby.reduce((sum, v) => sum + v.aisTrackSymbol.getLatLng().lng, 0) / nearby.length;

    //                 const clusterIcon = L.divIcon({
    //                     html: `<div class="cluster-icon">${nearby.length}</div>`,
    //                     className: "custom-cluster",
    //                     iconSize: [20, 20],
    //                 });

    //                 const clusterMarker = L.marker([avgLat, avgLon], { icon: clusterIcon });
    //                 clusterMarker.addTo(map);
    //                 clusterMap.set(`cluster-${vessel.id}`, clusterMarker);
    //             }
    //         }
    //     };

    //     updateClusters(); // initial render
    //     map.on("zoomend", updateClusters);

    //     return () => {
    //         map.off("zoomend", updateClusters);
    //         clusterMap.forEach(marker => map.removeLayer(marker));
    //         clusterMap.clear();
    //     };
    // }, [vessels, map]);

    return null;
};
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // meters
    const toRad = (deg: number) => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default VesselClusterLayer;
