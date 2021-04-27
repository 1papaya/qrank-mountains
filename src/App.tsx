import type { WebMercatorViewport } from "viewport-mercator-project";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useState } from "react";
import mapStyle from "./style.json";
import "./App.css";

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
      ></ReactMapGL>
    </div>
  );
}

export default App;
