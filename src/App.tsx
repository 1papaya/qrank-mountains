import { Link, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import type { LayerProps } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useState } from "react";
import "@fontsource/roboto";
import "./App.css";

import Map from "./Map";

const useStyles = makeStyles((theme) => ({
  qrankBox: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    width: 300,
    padding: theme.spacing(1),
    maxHeight: `calc(100vh - ${theme.spacing(4)})`,
    overflowY: "auto",
  },
  textField: {
    "& textarea": {
      fontFamily: "monospace",
      fontSize: "0.8rem",
      lineHeight: "1.3",
    },
  },
  textFieldInput: {},
}));

const isValidJson = (jsonStr: string) => {
  try {
    JSON.parse(jsonStr);
  } catch (e) {
    return false;
  }
  return true;
};

function App() {
  const classes = useStyles();
  // style defaults
  const defaultLayout = {
    "text-font": ["Roboto Regular"],
    "text-field": "{name}\n{qrank}",
    "text-anchor": "left" as "left",
    "text-size": 11,
    "text-justify": "left" as "left",
    "text-offset": [0.8, 0.13],
    "text-max-width": 20,
    "icon-image": "mountain",
    "icon-size": 0.4,
    "icon-allow-overlap": true,
  };
  const defaultFilter: any[] = [
    "case",
    ["<", ["zoom"], 2],
    [">", ["get", "qrank"], 500000],
    ["<", ["zoom"], 3],
    [">", ["get", "qrank"], 250000],
    ["<", ["zoom"], 4],
    [">", ["get", "qrank"], 100000],
    [">", ["get", "qrank"], 0],
  ];
  const defaultPaint = {
    "text-halo-width": 1,
    "text-halo-color": "#fff",
    "text-halo-blur": 0.2,
  };

  // layout state
  const [layout, setLayout] = useState<LayerProps["layout"] | null>(
    defaultLayout
  );
  const [filter, setFilter] = useState<LayerProps["filter"] | null>(
    defaultFilter
  );
  const [paint, setPaint] = useState<LayerProps["paint"] | null>(defaultPaint);

  return (
    <div className="App">
      <Map
        layout={layout ? layout : defaultLayout}
        filter={filter ? filter : defaultFilter}
        paint={paint ? paint : defaultPaint}
      />
      <Paper className={classes.qrankBox}>
        <Grid item container spacing={1}>
          <Grid item container>
            <Typography variant="body2">
              <Link
                href="https://github.com/geodavey/qrank-mountains"
                target="_blank"
                rel="noopener"
              >
                source
              </Link>
              {" / "}
              <Link
                href="/mountains_meta_qrank.json"
                target="_blank"
                rel="noopener"
              >
                data
              </Link>
              : id (str) name (str) qrank (int)
            </Typography>
          </Grid>
          <Grid item container>
            <TextField
              id="layout"
              size="small"
              label="layout"
              multiline
              variant="filled"
              fullWidth
              maxRows={8}
              error={layout === null}
              defaultValue={JSON.stringify(defaultLayout, null, 2)}
              classes={{
                root: classes.textField,
              }}
              onChange={(e) => {
                if (isValidJson(e.target.value))
                  setLayout(JSON.parse(e.target.value));
                else setLayout(null);
              }}
            />
          </Grid>
          <Grid item container>
            <TextField
              id="paint"
              size="small"
              label="paint"
              multiline
              variant="filled"
              fullWidth
              maxRows={8}
              error={paint === null}
              defaultValue={JSON.stringify(defaultPaint, null, 2)}
              classes={{
                root: classes.textField,
              }}
              onChange={(e) => {
                if (isValidJson(e.target.value))
                  setPaint(JSON.parse(e.target.value));
                else setPaint(null);
              }}
            />
          </Grid>
          <Grid item container>
            <TextField
              id="filter"
              size="small"
              label="filter"
              multiline
              variant="filled"
              fullWidth
              maxRows={20}
              error={filter === null}
              defaultValue={JSON.stringify(defaultFilter, null, 2)}
              classes={{
                root: classes.textField,
              }}
              onChange={(e) => {
                if (isValidJson(e.target.value))
                  setFilter(JSON.parse(e.target.value));
                else setFilter(null);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default App;
