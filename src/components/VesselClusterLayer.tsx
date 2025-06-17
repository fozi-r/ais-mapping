// components/VesselClusterLayer.tsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useMap } from 'react-leaflet';
import { Vessel } from '../models/Vessel';
import '../App.css';
interface Props {
  vessels: Record<string, Vessel>;
}

const VesselClusterLayer = ({ vessels }: Props) => {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    // Only create the cluster group once
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 10,
        disableClusteringAtZoom: 15,
        showCoverageOnHover: false,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div class="custom-cluster">${count}</div>`,
            className: "custom-cluster-wrapper",
            iconSize: L.point(15, 15),
          }) as L.Icon<L.IconOptions>; 
        },

      });
      map.addLayer(clusterGroupRef.current);
    }

    const clusterGroup = clusterGroupRef.current!;
    const markerMap = markerMapRef.current;
    const currentVesselIds = new Set(Object.keys(vessels));

    
    const toPacificTime = (utcDate?: Date): string | undefined => {
        if (!utcDate) return undefined;
        return new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles", // Covers both PST and PDT
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }).format(utcDate);
      };
    Object.values(vessels).forEach((vessel) => {
      if (!vessel.lat || !vessel.lon) return;
      if (typeof vessel.isVisible === 'function' && !vessel.isVisible()) return;

      const existing = markerMap.get(vessel.id);
      const newLatLng = L.latLng(vessel.lat, vessel.lon);
      const icon = getRotatedIcon(vessel);
      
      const lastUpdate = toPacificTime(vessel.lastMoved);

      const popupHtml = `
        <strong>${vessel.name ?? "Unknown"}</strong><br/>
        Lat: ${vessel.lat.toFixed(4)}<br/>
        Lon: ${vessel.lon.toFixed(4)}<br/>
        Type: ${vessel.shipType ?? "N/A"}<br/>
        Class: ${vessel.getClassLabel?.() ?? vessel.aisClass ?? "N/A"}<br/>
        Last Update: ${lastUpdate ?? "N/A"}
      `;

      if (existing) {
        const currentLatLng = existing.getLatLng();
        if (currentLatLng.lat !== newLatLng.lat ||
            currentLatLng.lng !== newLatLng.lng
          ) {
            existing.setLatLng(newLatLng);
          }
        if (existing.getPopup()?.getContent() !== popupHtml) {
          existing.setIcon(icon);
          existing.bindPopup(popupHtml);
        }
      } else {
        const marker = L.marker(newLatLng, { icon }).bindPopup(popupHtml);
        clusterGroup.addLayer(marker);
        markerMap.set(vessel.id, marker);
      }
    });



    // Remove stale markers
    markerMap.forEach((marker, id) => {
        if (!currentVesselIds.has(id)) {
          clusterGroup.removeLayer(marker);
          markerMap.delete(id);
        }
      });
      
  }, [vessels, map]);

  return null;
};

const iconMap: Record<string, string> = {
  "active": "/assets/ais_active.svg",
  "high-speed": "/assets/ais_highspeed.svg",
  "special": "/assets/ais_special.svg",
  "passenger": "/assets/ais_passenger.svg",
  "tanker": "/assets/ais_tanker.svg",
  "cargo": "/assets/ais_cargo.svg",
  "other": "/assets/ais_other.svg",
  "base": "/assets/ais_base.svg",
  default: "/assets/ais_other.svg"
};

function getVesselIconUrl(vesselTypeId?: number, aisClass?: string):string {
  let iconUrl = iconMap.default;

  
  if(vesselTypeId !== undefined){
    if(vesselTypeId >= 10 && vesselTypeId <= 39){
      iconUrl = iconMap["active"];
    }else if(vesselTypeId < 50){
      iconUrl = iconMap["high-speed"];
    }else if(vesselTypeId < 60){
      iconUrl = iconMap["special"];
    }else if(vesselTypeId < 70){
      iconUrl = iconMap["passenger"];
    }else if(vesselTypeId < 80){
      iconUrl = iconMap["cargo"];
    }else if(vesselTypeId < 90){
      iconUrl = iconMap["tanker"];
    }
  }else if(aisClass !== undefined && aisClass === "BASE"){
    iconUrl = iconMap["base"];
  }
  
  return iconUrl;
}
function getRotatedIcon(vessel: Vessel): L.DivIcon {
  //console.log("rotation", rotation);
  const rotation = vessel.getHeadingDegrees?.() ?? 0;
  const iconUrl = getVesselIconUrl(vessel.shipTypeId, vessel.aisClass);
  const scale = vessel.aisClass === "BASE" ? 0.6 : 0.8;

  
  return L.divIcon({
    className: 'vessel-icon',
    html: `<div class="vessel-icon-inner" style="transform: rotate(${rotation}deg) scale(${scale}); width: 30px; height: 30px;">
             <img src="${iconUrl}" />
           </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
}
export default VesselClusterLayer;
