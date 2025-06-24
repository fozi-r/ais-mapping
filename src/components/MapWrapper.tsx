import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import VesselMarkers from "./VesselMarkers";
import "leaflet/dist/leaflet.css";
import VesselClusterLayer from './VesselClusterLayer3';
import { useVessels } from "../hooks/useVessels";
import { useState } from "react";
import { useFilteredVessels } from "../hooks/useFilteredVessels";
import AisClassFilter from "./filters/AisClassFilter";
import DockLayer from './DockLayer';
import FilterPanel from "./filters/FilterPanel";

/**
 * 
 * @returns A MapContainer component that displays a map with vessel markers, filters, and layers
 * 
 */
const MapWrapper = () => {
  const [aisClassFilter, setAisClassFilter] = useState<string[]>([]);
  const [vesselTypeFilter, setVesselTypeFilter] = useState<string[]>([]);
  const [imoSearch, setImoSearch] = useState<string>("")
  const vessels = useVessels();
  const filteredVessels = useFilteredVessels(
    vessels,
    aisClassFilter,
    vesselTypeFilter,
    imoSearch
  );
  return (
    <MapContainer center={[47.6, -122.3]} zoom={10} style={{ height: "100vh" }}>
      
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="OpenSeaMap (Seamarks)">
          <TileLayer
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
            attribution="© OpenSeaMap contributors"
          />
        </LayersControl.Overlay>
      </LayersControl>
      {/* <DockLayer /> */}
      <VesselClusterLayer vessels={filteredVessels} />
      {/* <AisClassFilter value={aisClassFilter} onChange={setAisClassFilter} /> */}
      <FilterPanel
        aisClass={aisClassFilter}
        vesselType={vesselTypeFilter}
        imoSearch={imoSearch}
        onChange={{
          setAisClass: setAisClassFilter,
          setVesselType: setVesselTypeFilter,
          setImoSearch: setImoSearch,
        }}
      />

    </MapContainer>
  );

};

export default MapWrapper;
