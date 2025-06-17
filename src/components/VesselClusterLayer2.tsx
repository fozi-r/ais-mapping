import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { Vessel } from '../models/Vessel';
import '../App.css';
// import {
//   PruneCluster,
//   PruneClusterForLeaflet
// } from 'exports-loader?PruneCluster,PruneClusterForLeaflet!prunecluster/dist/PruneCluster.js';

interface Props {
  vessels: Record<string, Vessel>;
}

const VesselClusterLayer = ({ vessels }: Props) => {
//     const PruneCluster = (window as any).PruneCluster;
//     const PruneClusterForLeaflet = (window as any).PruneClusterForLeaflet;

//   const map = useMap();
//   const pruneClusterRef = useRef<InstanceType<typeof PruneClusterForLeaflet> | null>(null);
   const markerMapRef = useRef<Map<string, any>>(new Map());
  const map = useMap();
  const pruneClusterRef = useRef<any>(null);    

  useEffect(() => {
    const PruneClusterForLeaflet = (window as any).PruneClusterForLeaflet;
console.log('window.PruneCluster:', (window as any).PruneCluster);
console.log('window.PruneClusterForLeaflet:', (window as any).PruneClusterForLeaflet);
    // if (!PruneClusterForLeaflet ||  typeof PruneClusterForLeaflet !== 'object') {
    //   console.error('PruneClusterForLeaflet not loaded or not a constructor');
    //   return;
    // }

    
    if (!pruneClusterRef.current) {
      const cluster = new (window as any).PruneClusterForLeaflet();
      cluster.BuildLeafletMarker = function (marker: { position: { lat: number; lon: number; }; }, data: { heading: number; scale: any; iconUrl: any; popup: ((layer: L.Layer) => L.Content) | L.Content | L.Popup; }) {
        if (typeof marker.position.lat !== 'number' || typeof marker.position.lon !== 'number') {
            return L.marker([0, 0], {
                opacity: 0,
                icon: L.divIcon({ className: 'hidden-marker' })
              });
        }
        const rotation = data.heading ?? 0;
        const icon = L.divIcon({
          className: 'vessel-icon',
          html: `
            <div class="vessel-icon-inner" style="transform: rotate(${rotation}deg) scale(${data.scale}); width: 30px; height: 30px;">
              <img src="${data.iconUrl}" />
            </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10],
        });

        const leafletMarker = L.marker([marker.position.lat, marker.position.lon], { icon });

        if (data.popup) {
          leafletMarker.bindPopup(data.popup);
        }

        return leafletMarker;
      };

      pruneClusterRef.current = cluster;
      map.addLayer(cluster);
    }

    const cluster = pruneClusterRef.current!;
    const markerMap = markerMapRef.current;
    markerMap.clear();
    cluster.RemoveMarkers();

    const toPacificTime = (utcDate?: Date): string | undefined => {
      if (!utcDate) return undefined;
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
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
        if (
            typeof vessel.lat !== 'number' || isNaN(vessel.lat) ||
            typeof vessel.lon !== 'number' || isNaN(vessel.lon)
          ) {
            console.warn('Skipping vessel due to invalid coords:', vessel.id, vessel.lat, vessel.lon);
            return;
          }
      //if (typeof vessel.isVisible === 'function' && !vessel.isVisible()) return;

      const popupHtml = `
        <strong>${vessel.name ?? "Unknown"}</strong><br/>
        Lat: ${vessel.lat.toFixed(4)}<br/>
        Lon: ${vessel.lon.toFixed(4)}<br/>
        Type: ${vessel.shipType ?? "N/A"}<br/>
        Class: ${vessel.getClassLabel?.() ?? vessel.aisClass ?? "N/A"}<br/>
        Last Update: ${toPacificTime(vessel.lastMoved) ?? "N/A"}
      `;

      const marker =  new (window as any).PruneCluster.Marker(vessel.lat, vessel.lon);
      marker.data = {
        heading: vessel.getHeadingDegrees?.() ?? 0,
        scale: vessel.aisClass === "BASE" ? 0.6 : 0.8,
        iconUrl: getVesselIconUrl(vessel.shipTypeId, vessel.aisClass),
        popup: popupHtml
      };
      //console.log('Registering vessel marker:', vessel.id, vessel.lat, vessel.lon);
      cluster.RegisterMarker(marker);
      markerMap.set(vessel.id, marker);
    });

    cluster.ProcessView(); // Redraw visible markers
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