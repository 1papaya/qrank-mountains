import type { WebMercatorViewport } from "viewport-mercator-project";
import qrankMountains from "./mountains_meta_qrank.json";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useState } from "react";
import ReactMapGL, { Layer, Source } from "react-map-gl";
import mapStyle from "./style.json";
import "./App.css";

console.log(qrankMountains);

function App() {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={mapStyle}
        onViewportChange={(nextViewport: WebMercatorViewport) =>
          setViewport(nextViewport)
        }
      >
        <Source
          id="mountains"
          type="geojson"
          data={qrankMountains as GeoJSON.FeatureCollection}
        >
          <Layer
            id="mountains"
            type="symbol"
            layout={{
              "text-font": ["Roboto Regular"],
              "text-field": "{name}",
              "text-size": 11
            }}
            paint={{}}
          />
        </Source>
      </ReactMapGL>
    </div>
  );
}

export default App;
