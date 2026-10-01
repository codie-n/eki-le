import fs from "node:fs";

const GTS = JSON.parse(fs.readFileSync("prisma/data/greaterTokyoStations.geojson", "utf-8"));

// Sorts stations by the group codes
const sortedGTS = GTS.features.sort((a, b) => {
    return a.properties.S12_001g - b.properties.S12_001g;
});

// Converts the sorted stations into a single line JSON string
const singleLineGTS = sortedGTS.map((feature) => {
    return JSON.stringify(feature);
});

// Separates the single string with commas and new lines for better readability
const addNewLines = singleLineGTS.join(",\n");

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

console.log(`Sorted ${sortedGTS.length} station records and saved it to data/greaterTokyoStations.geojson.`);

