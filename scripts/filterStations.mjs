import fs from "node:fs";
import * as turf from "@turf/turf";

const stationData = JSON.parse(fs.readFileSync("data/S12-25_NumberOfPassengers.geojson"));
const boundaryData = JSON.parse(fs.readFileSync("data/greaterTokyoBoundary.geojson"));

const filteredStations = stationData.features.filter((station) => {
    const midpoint = turf.midpoint(station.geometry.coordinates[0], station.geometry.coordinates[1]);
    return boundaryData.features.some((boundary) => {
        turf.booleanPointInPolygon(midpoint, boundary.geometry);
    })
});

return filteredStations;
