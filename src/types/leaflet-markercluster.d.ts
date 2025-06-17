import * as L from 'leaflet';

// declare module 'leaflet' {
//   function markerClusterGroup(options?: any): L.LayerGroup;
// }

import * as L from 'leaflet';

declare module 'leaflet' {
  interface MarkerClusterGroupOptions extends L.LayerOptions {
    maxClusterRadius?: number | ((zoom: number) => number);
    iconCreateFunction?: (cluster: any) => L.Icon;
    clusterPane?: string;
    spiderLegPolylineOptions?: L.PolylineOptions;
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    singleMarkerMode?: boolean;
    disableClusteringAtZoom?: number;
    removeOutsideVisibleBounds?: boolean;
    animate?: boolean;
    animateAddingMarkers?: boolean;
    chunkedLoading?: boolean;
    chunkInterval?: number;
    chunkDelay?: number;
    chunkProgress?: (
      processed: number,
      total: number,
      elapsed: number
    ) => void;
  }

  class MarkerClusterGroup extends L.FeatureGroup {
    constructor(options?: MarkerClusterGroupOptions);
    addLayer(layer: L.Layer): this;
    addLayers(layers: L.Layer[]): this;
    clearLayers(): this;
    getBounds(): L.LatLngBounds;
    getLayers(): L.Layer[];
    eachLayer(fn: (layer: L.Layer) => void, context?: any): this;
    getVisibleParent(marker: L.Marker): L.Layer;
  }

  function markerClusterGroup(
    options?: MarkerClusterGroupOptions
  ): MarkerClusterGroup;
}
