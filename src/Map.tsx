import type { WebMercatorViewport } from "viewport-mercator-project";
import type { LayerProps, MapRef } from "react-map-gl";
import qrankMountains from "./mountains_meta_qrank.json";
import naturalEarthLand from "./ne_110m_land.json";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { memo, useState, useRef, useEffect } from "react";
import ReactMapGL, { Layer, Source } from "react-map-gl";
import mapStyle from "./style.json";
import "@fontsource/roboto";
import "./App.css";

const Map = (props: {
  layout: LayerProps["layout"];
  filter: LayerProps["filter"];
  paint: LayerProps["paint"];
}) => {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 0,
  });

  const mapRef = useRef<MapRef>(null);
  const { layout, paint, filter } = props;

  useEffect(() => {
    if (mapRef.current) {
      const map = (mapRef.current as MapRef).getMap();

      map.loadImage("/mountain.png", (error: any, image: any) => {
        map.addImage("mountain", image);
      });
    }
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      ref={mapRef}
      width="100%"
      height="100%"
      mapStyle={mapStyle}
      mapOptions={{ hash: true }}
      onViewportChange={(nextViewport: WebMercatorViewport) =>
        setViewport(nextViewport)
      }
    >
      <Source
        id="ne"
        type="geojson"
        data={naturalEarthLand as GeoJSON.FeatureCollection}
      >
        <Layer id="ne" type="line" paint={{}} />
      </Source>
      <Source
        id="mountains"
        type="geojson"
        data={qrankMountains as GeoJSON.FeatureCollection}
      >
        <Layer
          id="mountains"
          type="symbol"
          layout={layout}
          paint={paint}
          filter={filter}
        />
      </Source>
    </ReactMapGL>
  );
};

export default memo(Map);
