// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, LayersControl, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { connectSignalK } from "../services/signalk";

// interface Vessel {
//     id: string;
//     name: string;
//     lat: number;
//     lon: number;
// }

// const Map = () => {
//     const [vessels, setVessels] = useState<Record<string, Vessel>>({});

//     useEffect(() => {
//         const ws = connectSignalK((data: any) => {
//             setVessels(prevVessels => {
//                 const newVessels = { ...prevVessels };

//                 data.updates.forEach((update: any) => {
//                     update.values.forEach((value: any) => {
//                         if (value.path === "navigation.position") {
//                             const vesselId = data.context.replace(/^vessels\./, "") || "self";
//                             newVessels[vesselId] = {
//                                 id: vesselId,
//                                 name: update.source?.label || "Unknown Vessel",
//                                 lat: value.value.latitude,
//                                 lon: value.value.longitude,
//                             };
//                         }
//                     });
//                 });

//                 return newVessels;
//             });
//         },
//         [
//             {
//               context: "vessels.*",
//               subscribe: [{ path: "navigation.position" }],
//             },
//             {
//               context: "vessels.*",
//               subscribe: [{ path: "navigation.courseOverGroundTrue" }],
//             },
//           ]);

//         return () => ws.close();
//     }, []);


//     return (
//         <MapContainer center={[47.6, -122.3]} zoom={10} style={{ height: "100vh" }}>
//             <LayersControl position="topright">
//                 {/* Base Layer (always shown, but only one active at a time) */}
//                 <LayersControl.BaseLayer checked name="OpenStreetMap">
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='© OpenStreetMap contributors'
//                     />
//                 </LayersControl.BaseLayer>


//                 <LayersControl.Overlay checked name="OpenSeaMap (Seamarks)">
//                     <TileLayer
//                         url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
//                         attribution='© OpenSeaMap contributors'
//                     />
//                 </LayersControl.Overlay>
//             </LayersControl>
//             {Object.values(vessels).map((vessel) => (
//                 <Marker key={vessel.id} position={[vessel.lat, vessel.lon]}>
//                     <Popup>{vessel.name}</Popup>
//                 </Marker>
//             ))}
//         </MapContainer>
//     );
// };

 export default Map;
