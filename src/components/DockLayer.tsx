import React, { useEffect, useState } from 'react';
import { CircleMarker, Popup, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';

interface Dock {
  lat: number;
  lon: number;
  name: string;
  facilityType: string;
  commonName: string;
}

const DockLayer: React.FC = () => {
  const [docks, setDocks] = useState<Dock[]>([]);

  useEffect(() => {
    const csvUrl = '/data/Docks_WA.csv'; // or remote URL

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results: { data: any[]; }) => {
        const parsed: Dock[] = results.data
          .map((row: any) => {
            const lat = parseFloat(row['LATITUDE']);
            const lon = parseFloat(row['LONGITUDE']);
            const name = row['UNLOCODE'] || 'Unknown Dock';
            const facilityType = row['FACILITY_T'] || "unknown";
            const commonName = row['NAV_UNIT_N'] || row['CITY_OR_TO'] || "unknown";
            if (!isNaN(lat) && !isNaN(lon)) {
              return { lat, lon, name, facilityType, commonName };
            }
            return null;
          })
          .filter((dock): dock is Dock => dock !== null);
        setDocks(parsed);
      },
    });
  }, []);

  return (
    <LayerGroup>
  {docks.map((dock, idx) => (
    <CircleMarker
      key={idx}
      center={[dock.lat, dock.lon]}
      radius={4} // size of the circle in pixels
      pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.7 }}
    >
      <Popup>
        <strong>{dock.name}</strong><br />
        Name: {dock.commonName}<br/>
        Facility: {dock.facilityType}<br />
        Lat: {dock.lat}, Lon: {dock.lon}
      </Popup>
    </CircleMarker>
  ))}
</LayerGroup>
  );
};

export default DockLayer;
