import fs from "node:fs";
import * as turf from "@turf/turf";

const GTS = JSON.parse(fs.readFileSync("prisma/data/greaterTokyoStations.geojson", "utf-8"));

const stationMap = new Map();
for (const station of GTS.features) {
    const midpoint = turf.along(station, turf.length(station) / 2);
    const [lng, lat] = midpoint.geometry.coordinates;
    if (!stationMap.has(station.properties.S12_001g)) {
        const newRecord = {
            nameRomaji: null,
            nameKanji: station.properties.S12_001,
            acceptedNames: [station.properties.S12_001],
            prefecture: null,
            municipality: null,
            latitude: null,
            longitude: null,
            coordinates: [[lng, lat]],
            operators: [station.properties.S12_002],
            lineCount: 1,
            linesList: [station.properties.S12_003],
            duplicateCodes: [[station.properties.S12_058, station.properties.S12_003]],
            dataCodes: [[station.properties.S12_059, station.properties.S12_003]],
            notes: [[station.properties.S12_060, station.properties.S12_003]],
            dailyPassengers: [[station.properties.S12_061, station.properties.S12_003]],
            passengerRank: null,
            passengerTier: null
        }
        stationMap.set(station.properties.S12_001g, newRecord);
    } else {
        const existingRecord = stationMap.get(station.properties.S12_001g);
        if(!existingRecord.acceptedNames.includes(station.properties.S12_001)) {
            existingRecord.acceptedNames.push(station.properties.S12_001);
        }
        if (!existingRecord.coordinates.some((coord) => coord[0] === lng && coord[1] === lat)) {
            existingRecord.coordinates.push([lng, lat]);
        }
        if(!existingRecord.operators.includes(station.properties.S12_002)) {
            existingRecord.operators.push(station.properties.S12_002);
        }
        if(!existingRecord.linesList.includes(station.properties.S12_003)) {
            existingRecord.linesList.push(station.properties.S12_003);
        }
        existingRecord.lineCount = existingRecord.linesList.length;
        if(!existingRecord.duplicateCodes.some((pair) => pair[0] === station.properties.S12_058)) {
            existingRecord.duplicateCodes.push([station.properties.S12_058, station.properties.S12_003]);
        }
        if(!existingRecord.dataCodes.some((pair) => pair[0] === station.properties.S12_059)) {
            existingRecord.dataCodes.push([station.properties.S12_059, station.properties.S12_003]);
        }
        if(!existingRecord.notes.some((pair) => pair[0] === station.properties.S12_060)) {
            existingRecord.notes.push([station.properties.S12_060, station.properties.S12_003]);
        }
        existingRecord.dailyPassengers.push([station.properties.S12_061, station.properties.S12_003]);
    }
}

for (const station of stationMap.values()) {
    const points = turf.points(station.coordinates);
    const center = turf.center(points);
    const [lng, lat] = center.geometry.coordinates;
    station.latitude = lat;
    station.longitude = lng;
    delete station.coordinates;
}

const stationJSON = Array.from(stationMap.values());

fs.writeFileSync(
    "prisma/data/stations.json",
    JSON.stringify(stationJSON, null, 2),
    "utf-8"
);

console.log("stations.json has been built.");
