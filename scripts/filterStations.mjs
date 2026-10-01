import fs from "node:fs";
import * as turf from "@turf/turf";

const stationData = JSON.parse(fs.readFileSync("prisma/data/S12-25_NumberOfPassengers.geojson", "utf-8"));

const boundaryFiles = [
    "prisma/data/saitamaBoundaries.geojson",
    "prisma/data/chibaBoundaries.geojson",
    "prisma/data/tokyoBoundaries.geojson",
    "prisma/data/kanagawaBoundaries.geojson"
];
// Parses all the boundary files and combines them into a single array of "features"
const boundaryData = boundaryFiles.flatMap((file) => {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return data.features;
})

// Filters the station data to only include stations that are within the boundaries of the Greater Tokyo Area
const filteredStations = stationData.features.filter((station) => {
    // Finds the midpoint of a station from all of its coordinates
    const midpoint = turf.along(station, turf.length(station) / 2);

    return boundaryData.some((boundary) => {
        // Returns true if the midpoint is with the boundary polygon
        return turf.booleanPointInPolygon(midpoint, boundary);
    })
});

// Converts the filtered stations into a single line JSON string
const singleLineFilteredStations = filteredStations.map((feature) => {
    return JSON.stringify(feature);
});

// Separates the single string with commas and new lines for better readability
const addNewLines = singleLineFilteredStations.join(",\n");

// Wraps everything in a GEOJSON FeatureCollection format
const finalGEOJSON = `{
"type": "FeatureCollection",
"name": "greaterTokyoStations",
"features": [
${addNewLines}
]
}`;

fs.writeFileSync(
    "prisma/data/greaterTokyoStations.geojson",
    finalGEOJSON,
    "utf-8"
);

console.log(`Filtered ${filteredStations.length} station records within the Greater Tokyo Area and saved it to data/greaterTokyoStations.geojson.`);
