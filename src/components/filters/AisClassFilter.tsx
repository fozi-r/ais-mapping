import { useState } from "react";

// components/AisClassFilter.tsx
interface AisClassFilterProps {
    value: string[];
    onChange: (value: string[]) => void;
  }
  const ALL_CLASSES = ["A", "B", "BASE"];
  const AisClassFilter = ({ value, onChange }: AisClassFilterProps) => {
    const [isOpen, setIsOpen] = useState(true);

  const toggle = (cls: string) => {
    if (value.includes(cls)) {
      console.log(`check ${cls}`);
      onChange(value.filter((v) => v !== cls));
    } else {
      onChange([...value, cls]);
    }
  };

  const toggleAll = () => {
    if (value.length === ALL_CLASSES.length) {
      onChange([]); // Uncheck all
    } else {
      onChange(ALL_CLASSES); // Select all
    }
  };

  const allSelected = value.length === ALL_CLASSES.length;

  return (
    <div
      // style={{
      //   position: "relative",
      //   top: 80,
      //   left: 10,
      //   zIndex: 1000,
      //   background: "white",
      //   padding: "8px 12px",
      //   borderRadius: "8px",
      //   boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      //   minWidth: "160px",
      // }}
    >


      {isOpen && (
        <>
        <strong>AIS Class</strong>
          {/* <label style={{ display: "flex", marginBottom: "6px",gap: "6px" }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
            />{" "}
            All
          </label> */}
          {ALL_CLASSES.map((cls) => (
            <label key={cls} style={{ display: "flex", marginBottom: "4px", gap: "6px" }}>
              <input
                type="checkbox"
                checked={value.includes(cls)}
                onChange={() => toggle(cls)}
              />{" "}
              {cls}
            </label>
          ))}
        </>
      )}
    </div>
      );
    };
  export default AisClassFilter;
  