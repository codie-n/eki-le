import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";

// ECreate a native pool connection using your environment variable setup
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, });

// Wrap the pool instance inside the Prisma Pg Driver Adapter
const adapter = new PrismaPg(pool);

// Pass the active adapter definition into the client instance constructor
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting Eki-le database seed engine...");

  // Read raw station data from your JSON file
  const filePath = path.join(__dirname, "./data/stations.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const stations = JSON.parse(rawData);

  console.log(`Loaded ${stations.length} stations from JSON.`);

  // Clear existing table rows to prevent primary key collisions or duplicate data rows
  await prisma.station.deleteMany({});
  console.log("Cleared existing stations from the local database table.");

  // Create entries inside the database
  for (const station of stations) {
    await prisma.station.create({
      data: {
        nameRomaji: station.nameRomaji,
        nameKanji: station.nameKanji,
        kanjiLength: station.kanjiLength,
        romajiSearch: station.romajiSearch,
        prefecture: station.prefecture,
        municipality: station.municipality,
        latitude: station.latitude,
        longitude: station.longitude,
        operators: station.operators,
        lineCount: station.lineCount,
        linesList: station.linesList,
        passengerRank: station.passengerRank,
        passengerTier: station.passengerTier,
      },
    });
  }

  console.log(`Database successfully seeded with ${stations.length} stations.`);
}

main()
  .catch((error) => {
    console.error("Eki-le database seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
