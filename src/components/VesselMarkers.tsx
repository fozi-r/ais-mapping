import { Marker, Popup } from "react-leaflet";
import { useVessels } from "../hooks/useVessels";
import React from "react";
import { Vessel } from "../models/Vessel";


const VesselMarkers = () => {
  const vessels = useVessels();

  return (
    <>
      
        {Object.values(vessels).map(v => (
          <VesselMarker key={v.id} vessel={v} />
        ))}
    </>
  );
};

const VesselMarker = React.memo(
  ({ vessel }: { vessel: Vessel }) => {
    if (
      typeof vessel.lat !== "number" ||
      typeof vessel.lon !== "number" ||
      isNaN(vessel.lat) ||
      isNaN(vessel.lon)
    ) return null;

    return (
      <Marker position={[vessel.lat, vessel.lon]}>
        <Popup>
          <strong>{vessel.name}</strong><br />
          ID: {vessel.id}
        </Popup>
      </Marker>
    );
  },
  (prev, next) =>
    prev.vessel.lat === next.vessel.lat &&
    prev.vessel.lon === next.vessel.lon
);


// interface Props {
//   vessels: Record<string, Vessel>;
// }

// const VesselMarkers = ({ vessels }: Props) => {
//   return (
//     <>
//       {Object.values(vessels).map((vessel) => (
//         <Marker key={vessel.id} position={[vessel.lat, vessel.lon]}>
//           <Popup>
//             <strong>{vessel.name}</strong>
//             <br />
//             ID: {vessel.id}
//           </Popup>
//         </Marker>
//       ))}
//     </>
//   );
// };

export default VesselMarkers;
