-- CreateTable
CREATE TABLE "DailyStationSequence" (
    "dayIndex" INTEGER NOT NULL,
    "stationId" TEXT NOT NULL,
    "playDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyStationSequence_pkey" PRIMARY KEY ("dayIndex")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyStationSequence_stationId_key" ON "DailyStationSequence"("stationId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyStationSequence_playDate_key" ON "DailyStationSequence"("playDate");

-- AddForeignKey
ALTER TABLE "DailyStationSequence" ADD CONSTRAINT "DailyStationSequence_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
