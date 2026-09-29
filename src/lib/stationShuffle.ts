import { prisma } from "./prisma";

export async function generateStationSequence() {
  console.log('Initializing station shuffle...');

  // Fetch the top 365 station IDs sorted by passenger volume rank from the database
  const topStations = await prisma.station.findMany({
    orderBy: { passengerRank: "asc" }, // From the rank 1 busiest
    take: 365, // Only down to the rank 365
    select: { id: true }
});
  if (topStations.length < 365) {
    throw new Error("Insufficient stations in the database to generate a full year's sequence. Found: " + topStations.length);
  }

  // Clear the old sequence
  await prisma.dailySequence.deleteMany({});
  console.log("Cleared previous daily sequence.");

  // Use a Fisher Yates shuffle
  const shuffledList = topStations.map((s: { id: string }) => s.id);
  for (let i = shuffledList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
  }

  // Insert the newly mapped randomized order array into a sequence table
  const sequenceEntries = shuffledList.map((stationId: string, index: number) => ({
    dayIndex: index + 1,
    stationId: stationId
  }));

  await prisma.dailySequence.createMany({
    data: sequenceEntries
  });

  console.log("Shuffled queue generated successfully for the top 365 stations.");
}
