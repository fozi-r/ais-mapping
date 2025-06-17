import {AISTrackSymbol, PositionReport, ShipStaticData} from '@arl/leaflet-tracksymbol2';

export class Vessel {
    id: string;
    name?: string;
    mmsi?: string;
    lat?: number;
    lon?: number;
    cog?: number; // Radians
    aisClass?: string; // 'A' | 'B' | 'BASE' | etc.
    shipType?: string;
    shipTypeId?: number;
    lastMoved?: Date;
    isOnLand?: boolean;
    navState?: string;

    aisTrackSymbol?: AISTrackSymbol;
    shipStaticData: ShipStaticData = {
        userId: undefined,
        imoNumber: undefined,
        /** Call sign. */
        callSign: undefined,
        /** Name. */
        name: undefined,
        /** Type of ship and cargo type. */
        type: undefined,
        /** Overall dimension/reference for position. */
        dimension: undefined,
        /** Type of electronic position fixing device. */
        fixType: undefined,
        /** ETA. */
        eta: undefined,
        /** Maximum present static draught (m). */
        maximumStaticDraught: undefined,
        /** Destination. */
        destination: undefined,
        /** Data terminal equipment ready. */
        dte: undefined,
    };
    positionReport: PositionReport = {
        userId: undefined,
        navigationalStatus: undefined,
        /** Rate of turn. AIS encoded value. */
        rateOfTurn: undefined,
        /** Speed over ground (knots), 102.3 = not available . */
        sog: undefined,
        /** Position accuracy. */
        positionAccuracy: undefined,
        /** Longitude. */
        longitude: -1,
        /** Latitude. */
        latitude: -1,
        /** Course over ground (degrees, 360 = not available, \> 360 not used). */
        cog: undefined,
        /** True heading (degrees, 511 = not available) */
        trueHeading: undefined,
        /** UTC second when the report was generated. 60 = not available, 61 = manual input mode, 62 = estimated / dead reckoning mode, 63 = inoperative) */
        timestamp: undefined,
        /** Special manoeuvre indicator. */
        specialManoeuvreIndicator: undefined,
        /** Receiver autonomous integrity monitoring flag. */
        raim: undefined,
    };
  
    constructor(id: string) {
      this.id = id;
    }
  
    /**
     * Apply Signal K delta updates directly to this vessel instance.
     */
    update(path: string, value: any, timestamp?: string) {
      switch (path) {
        case "navigation.position":
          if (this.lat !== value.latitude || this.lon !== value.longitude) {
            this.lat = value.latitude;
            this.lon = value.longitude;
            this.lastMoved = timestamp !== undefined ? new Date(timestamp) : new Date(); // update movement time
            this.positionReport.latitude = value.latitude;
            this.positionReport.longitude = value.longitude;
            this.refreshPosition();
          }
          break;
        case "":
        //   if (value?.name) this.name = value.name;
        //   if (value?.mmsi) this.mmsi = value.mmsi;
          if (value?.name) this.shipStaticData.name = value.name;
          if (value?.mmsi) this.shipStaticData.userId = value.mmsi;
          if (value?.registrations?.imo) this.shipStaticData.imoNumber = parseInt(value?.registrations?.imo.split(" ")[1],10);
          this.refreshStaticData();
          break;
        case "navigation.courseOverGroundTrue":
          this.cog = value;
          this.positionReport.cog = this.getHeadingDegrees();
          this.refreshPosition();
          break;
        case "navigation.headingTrue":
            this.positionReport.trueHeading = value * (180 / Math.PI);
            this.refreshPosition();
            break;
        case "navigation.state":
          this.positionReport.navigationalStatus = value.id;
          this.refreshPosition();
          break;
        case "navigation.destination.commonName":
          this.shipStaticData.destination = value;
          this.refreshStaticData();
          break;
        case "navigation.destination.eta":
          const date = new Date(value);
          this.shipStaticData.eta = AISTrackSymbol.etaFromDate(date); //{month: date.getUTCMonth() + 1, day: date.getUTCDate(), hour: date.getUTCHours(), minute: date.getUTCMinutes()};
          this.refreshStaticData();
          break;
        case "sensors.ais.class":
          this.aisClass = value;
          break;
        case "design.aisShipType":
          if (typeof value === 'object') {
            this.shipType = value.name;
            // this.shipTypeId = value.id;
            this.shipStaticData.type = value.id;
            this.refreshStaticData();
          }
          break;

      }
    }

    refreshPosition(){
        if(!this.positionReport.trueHeading){
            this.positionReport.trueHeading = this.getHeadingDegrees();
        }
        if(!this.aisTrackSymbol){
            this.aisTrackSymbol = new AISTrackSymbol(this.positionReport, {shipStaticData: this.shipStaticData, size: 15});
        }else{
            this.aisTrackSymbol.setPositionReport(this.positionReport);
        }
    }

    refreshStaticData(){
        if(!this.aisTrackSymbol){
            return;
        }else{
            this.aisTrackSymbol.setShipStaticData(this.shipStaticData as ShipStaticData);
        }
    }
  
    /**
     * Converts COG (in radians) to degrees.
     */
    getHeadingDegrees(): number | undefined {
      return this.cog !== undefined ? this.cog * (180 / Math.PI) : undefined;
    }
  
    /**
     * Friendly label for AIS class.
     */
    getClassLabel(): string {
      if (this.aisClass === 'A') return 'Class A';
      if (this.aisClass === 'B') return 'Class B';
      if (this.aisClass === 'BASE') return 'Base Station';
      return this.aisClass ?? 'Unknown';
    }
  
    /**
     * Returns whether this vessel is likely inactive (e.g., docked long-term).
     */
    isInactive(referenceDate: Date = new Date(), days = 7): boolean {
      if (!this.lastMoved) return false;
      const diff = referenceDate.getTime() - this.lastMoved.getTime();
      return diff > days * 86400000;
    }
  
    /**
     * Controls whether this vessel should be shown on map.
     * You can expand this to use navigation.state if needed later.
     */
    isVisible(referenceDate: Date = new Date()): boolean {
      // Optional placeholder logic — update with nav state if you want
      if (typeof this.lat !== 'number' || typeof this.lon !== 'number') return false;
      if (this.isInactive(referenceDate) && this.isOnLand) return false;
      return true;
    }
  
    /**
     * Optional: display-friendly name fallback.
     */
    getDisplayName(): string {
      return this.name || this.mmsi || this.id;
    }
  }
  