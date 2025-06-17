export interface Vessel {
    id: string;
    name: string;
    lat?: number;
    lon?: number;
    cog?: number;
    mmsi?: string;
    shipType?: string;
    shipTypeId?: number;
    aisClass?: string;
  }//add speed