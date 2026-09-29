import { prisma } from "./prisma";
import { generateStationSequence } from "./stationShuffle";

export async function getDailyStation() {
  // Get the current date string in YYYY-MM-DD format
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // Converts the Date() to a string and removes the time, eg. "2026-09-28"

  // Get the current game status from the database
  let sequenceStatus = await prisma.gameStatus.findUnique({
    where: { id: 1}
  });

  // If the game status doesn't exist, create it and generate a new station sequence
  if (!sequenceStatus) {
    sequenceStatus = await prisma.gameStatus.create({
        data: { id:1,
            currentDayIndex: 1,
            lastUpdatedDate: dateString
        }
    });

    await generateStationSequence();
  }

  let totalStations = await prisma.dailyStationSequence.count();
  if (totalStations === 0) {
    await generateStationSequence();
    totalStations = await prisma.dailyStationSequence.count();
  }

  // If the last updated date is not today, check if a new sequence needs to be generated and update the game status
  if (sequenceStatus.lastUpdatedDate !== dateString) {

    // Check if the current day index equals 365, and generate a new sequence if so
    if (sequenceStatus.currentDayIndex === 365) {
        await generateStationSequence();
        sequenceStatus.currentDayIndex = 0; // Reset the day index to 0
    }

    // Update the game status, incrementing the current day index and updating the last updated date
    sequenceStatus = await prisma.gameStatus.update({
        where: { id: 1 },
        data: {
            currentDayIndex: sequenceStatus.currentDayIndex + 1,
            lastUpdatedDate: dateString
        }
    });
    console.log(`Game status updated: Day index is now ${sequenceStatus.currentDayIndex}, last updated date is ${sequenceStatus.lastUpdatedDate}`);
  }


  // Get the daily station for the current day index, including the station data
  const dailyStation = await prisma.dailyStationSequence.findUnique({
    where: { dayIndex: sequenceStatus.currentDayIndex },
    include: { station: true }
  });


  // Update the playDate for the current station to today, so we know when it was last played
  //await prisma.dailyStationSequence.update({
    //where: { dayIndex: sequenceStatus.currentDayIndex },
    //data: { playDate: today }
  //});

  return dailyStation;
}