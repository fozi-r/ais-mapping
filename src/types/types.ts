interface Facility {
    lat: number;
    lon: number;
    name: string;
    facilityType: "Dock" |
                "Open Water" |
                "Marina" |
                "Junction" |
                "Anchorage" |
                "Lock Chamber" |
                "Bridge" |
                "Lock and/or Dam" |
                "Fleeting Area" |
                "Cargo Handling Facility" |
                "Non Cargo Handling Facility" |
                "Pier" |
                "Tie Off" |
                "Virtual Dock" |
                "Virtual Marina" 
                ;
    
    city?: string;
    portName?: string;
  }
  export {}