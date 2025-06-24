import React, { useState } from "react";
import AisClassFilter from "./AisClassFilter";
import VesselTypeFilter from "./VesselTypeFilter";
import ImoSearch from "./ImoSearch";

/**
 * FilterPanel component for managing AIS class, vessel type, and IMO search filters
 */
interface FilterPanelProps {
  aisClass: string[];
  vesselType: string[];
  imoSearch: string;
  onChange: {
    setAisClass: (v: string[]) => void;
    setVesselType: (v: string[]) => void;
    setImoSearch: (v: string) => void;
  };
}

/**
 * 
 * @param param0 - Props for the FilterPanel component, including AIS class, vessel type, IMO number
 * @returns combined filter panel component
 */
const FilterPanel = ({
  aisClass,
  vesselType,
  imoSearch,
  onChange,
}: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 10,
        zIndex: 1000,
        background: "white",
        padding: "12px",
        borderRadius: "8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        width: "200px",
      }}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          marginBottom: isOpen ? "10px" : 0,
          padding: "6px",
          fontSize: "14px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      {isOpen && (
        <>
          <AisClassFilter value={aisClass} onChange={onChange.setAisClass} />
          <hr style={{ margin: "10px 0" }} />
          <VesselTypeFilter
            value={vesselType}
            onChange={onChange.setVesselType}
          />
          <hr style={{ margin: "10px 0" }} />
          <ImoSearch value={imoSearch} onChange={onChange.setImoSearch} />
        </>
      )}
    </div>
  );
};

export default FilterPanel;
