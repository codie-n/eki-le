import fs from "node:fs";

const stationList = JSON.parse(fs.readFileSync("prisma/data/greaterTokyoStations.geojson", "utf-8"));

// Uses a Map to track unique station group codes and then filters for stations with duplicates
const stationMap = new Map();
const duplicateStations = stationList.features.filter((station) => {
    if(!stationMap.has(station.properties.S12_001g)) {
        stationMap.set(station.properties.S12_001g, station.properties.S12_001);
    } else {
        return true;
    }
});

// Sorts the duplicate stations by their group codes
const dupesSorted = duplicateStations.sort((a, b) => {
    return a.properties.S12_001g - b.properties.S12_001g
});

// Converts the duplicate stations into a single line JSON string
const singleLineDuplicateStations = dupesSorted.map((feature) => {
    return JSON.stringify(feature);
});

// Separates the single string with commas and new lines for better readability
const addNewLines = singleLineDuplicateStations.join(",\n");

// Wraps everything in a GEOJSON FeatureCollection format
const finalGEOJSON = `{
"type": "FeatureCollection",
"name": "duplicateStations",
"features": [
${addNewLines}
]
}`;

fs.writeFileSync(
    "prisma/data/duplicateStations.geojson",
    finalGEOJSON,
    "utf-8"
);

console.log(`Found ${duplicateStations.length} duplicate station records and saved it to data/duplicateStations.geojson.`);
