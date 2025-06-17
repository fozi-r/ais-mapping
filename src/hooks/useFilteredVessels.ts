// hooks/useFilteredVessels.ts
// import { useMemo } from "react";
// import { Vessel } from "../models/Vessel"; // adjust import if needed

// export function useFilteredVessels(
//   vessels: Record<string, Vessel>,
//   aisClassFilter: string[]
// ) {
//   return useMemo(() => {
//     return Object.fromEntries(
//     Object.entries(vessels).filter(([_, vessel]) => {
//         if (aisClassFilter.length === 0) return true; // no filters = show all
//         return vessel.aisClass && aisClassFilter.includes(vessel.aisClass);
//     })
//     );
//   }, [vessels, aisClassFilter]);
// }
import { useMemo } from "react";
import { Vessel } from "../models/Vessel";

export function useFilteredVessels(
  vessels: Record<string, Vessel>,
  aisClassFilter: string[],
  vesselTypeFilter: string[],
  imoSearch: string
) {
  const normalizedSearch = imoSearch.trim().toLowerCase();
  const TYPE_CODE_RANGES: Record<string, [number, number]> = {
    'Wing in Ground': [20,29],
    'Pleasure': [30,39],
    'High Speed': [40, 49],
    'Special': [50, 59],
    'Passenger': [60, 69],
    'Cargo': [70, 79],
    'Tanker': [80, 89],
    'Other': [90,99],
  };

  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(vessels).filter(([_, vessel]) => {
        const matchAisClass =
          aisClassFilter.length === 0 ||
          (vessel.aisClass && aisClassFilter.includes(vessel.aisClass));

          const matchVesselType =
          vesselTypeFilter.length === 0 ||
          (typeof vessel.shipStaticData.type === "number" &&
            vesselTypeFilter.some((category) => {
              const [min, max] = TYPE_CODE_RANGES[category];
              return vessel.shipStaticData.type && vessel.shipStaticData.type >= min && vessel.shipStaticData.type <= max;
            }));

        const matchSearch =
          !normalizedSearch ||
          (vessel.shipStaticData.imoNumber && vessel.shipStaticData.imoNumber.toString().includes(normalizedSearch));

        return matchAisClass && matchVesselType && matchSearch;
      })
    );
  }, [vessels, aisClassFilter, vesselTypeFilter, normalizedSearch]);
}
