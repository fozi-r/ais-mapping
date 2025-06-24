import { useEffect, useRef, useState } from "react";
import { connectSignalK, fetchVesselName } from "../services/signalk";
import { Vessel } from "../models/Vessel";

// Debounced real-time vessel data hook
/**
 * 
 * returns a record of vessels <string: signalk id, Vessel> with each vessel's delta transmitted from the SignalK server
 */
export function useVessels(): Record<string, Vessel> {
  const [renderedVessels, setRenderedVessels] = useState<Record<string, Vessel>>({});
  const vesselRef = useRef<Record<string, Vessel>>({});
  const frameRequested = useRef(false);
  const lastUpdate = useRef(0);
  const knownVesselIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const ws = connectSignalK(async (data: any) => {
      const vesselId = data.context.replace(/^vessels\./, "") || "self";
      
      //const vessel: Partial<Vessel> = { ...(vesselRef.current[vesselId] ?? {}), id: vesselId };
      if (!vesselRef.current[vesselId]) {
        vesselRef.current[vesselId] = new Vessel(vesselId);
      }

      const vessel = vesselRef.current[vesselId];
      data.updates.forEach((update: any) => {
        update.values.forEach((value: any) => {
          // const prev = vesselRef.current[vesselId];
          
          // if (value.path === "navigation.position") {
          //   vessel.lat = value.value.latitude;
          //   vessel.lon = value.value.longitude;
          // } else if (value.path === "" && value.value && "name" in value.value) {
          //   vessel.name = value.value.name;
          // } else if (value.path === "" && value.value && "mmsi" in value.value) {
          //   vessel.mmsi = value.value.mmsi;
          // }else if(value.path === "navigation.courseOverGroundTrue"){
          //   vessel.cog = value.value;
          // }else if(value.path === "sensors.ais.class"){
          //   vessel.aisClass = value.value;
          // }else if(value.path === "design.aisShipType"){
          //   vessel.shipType = value.value.name;
          //   vessel.shipTypeId = value.value.id;
          // }
          vessel.update(value.path, value.value, update.timestamp);
        });
      });
      
      vesselRef.current[vesselId] = vessel as Vessel;
      if(vessel.lat && vessel.lon){
        //console.log(`vessel ${vesselRef.current[vesselId].name} ${vesselRef.current[vesselId].mmsi}`)
      }
      // Object.entries(vessel).forEach(([key, value]) => {
      //   console.log(`${key}: ${value}`);
      // });
      //
      if (!frameRequested.current) {
        frameRequested.current = true;
        requestAnimationFrame(() => {
          const now = Date.now();
          frameRequested.current = false;

          if (now - lastUpdate.current > 50) {
            lastUpdate.current = now;
            setRenderedVessels({ ...vesselRef.current });
          }
        });
      }
    },
    [
      {
        context: "vessels.*",
        subscribe: [
          {path: "navigation.position" },
          {path: "navigation.courseOverGroundTrue"},
          {path: "navigation.headingTrue"},
          {path: "navigation.state"},
          {path: "navigation.destination"},
          {path: "navigation.destination.eta"},
          { path: "",
            policy: "fixed",
            period: 10000
          },
          {path: "design.aisShipType",
            policy: "fixed",
            period: 10000
          },
          {path: "sensors.ais.class",
            policy: "fixed",
            period: 10000
          }
        ],
      },
    ]);

    return () => ws.close();
  }, []);

  return renderedVessels;
}
