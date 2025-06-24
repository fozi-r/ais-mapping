import React from "react";

interface ImoSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * 
 * @param param0 - Component for searching vessels by IMO number
 * @returns 
 */
const ImoSearch = ({ value, onChange }: ImoSearchProps) => (
  <div>
    <strong>Search by IMO</strong>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter IMO number"
      style={{
        padding: "6px",
        width: "100%",
        marginTop: "4px",
        boxSizing: "border-box",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    />
  </div>
);

export default ImoSearch;
