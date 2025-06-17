import React from "react";

interface VesselTypeFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SilhouetteIcon = ({ stroke, fill }: { stroke: string; fill: string }) => {
  const scale = 20;
  const points = [
    [0.3, 0],
    [0.6, 0.8],
    [0, 0.8],
  ];
  const pointString = points.map(([x, y]) => `${x * scale},${y * scale}`).join(" ");

  return (
    <svg width={20} height={20} viewBox="0 0 15 20">
      <polygon points={pointString} stroke={stroke} fill={fill} strokeWidth="1.5" />
    </svg>
  );
};

const VESSEL_TYPE_COLORS: Record<string, { stroke: string; fill: string }> = {
  "Wing in Ground": { stroke: "#000000", fill: "#d3d3d3" }, // WIG_COLOR
  Pleasure: { stroke: "#8b008b", fill: "#ff00ff" }, // TYPE_3X_COLOR
  "High Speed": { stroke: "#00008b", fill: "#ffff00" }, // HSC_COLOR
  Special: { stroke: "#008b8b", fill: "#00ffff" }, // TYPE_5X_COLOR
  Passenger: { stroke: "#00008b", fill: "#0000ff" }, // PASSENGER_COLOR
  Cargo: { stroke: "#006400", fill: "#90ee90" }, // CARGO_COLOR
  Tanker: { stroke: "#8b0000", fill: "#ff0000" }, // TANKER_COLOR
  Other: { stroke: "#008b8b", fill: "#00ffff" }, // OTHER_COLOR
};

const VESSEL_TYPES = ["Wing in Ground", "Pleasure", "High Speed", "Special", "Passenger", "Cargo", "Tanker", "Other"]; // Modify as needed

const VesselTypeFilter = ({ value, onChange }: VesselTypeFilterProps) => {
  const toggle = (type: string) => {
    onChange(
      value.includes(type) ? value.filter((t) => t !== type) : [...value, type]
    );
  };

  return (
    <div>
      <strong>Vessel Type</strong>
      {VESSEL_TYPES.map((type) => {
        const color = VESSEL_TYPE_COLORS[type] || { stroke: "#000", fill: "#ccc" };
        return (
        <label key={type} style={{ display: "flex", marginBottom: "4px", gap: "6px"}}>
          <input
            type="checkbox"
            checked={value.includes(type)}
            onChange={() => toggle(type)}
          />{" "}
          <SilhouetteIcon stroke={color.stroke} fill={color.fill} />
          {type}
        </label>
      )})}
    </div>
  );
};

export default VesselTypeFilter;
