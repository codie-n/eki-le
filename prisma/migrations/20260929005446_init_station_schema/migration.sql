-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "nameRomaji" TEXT NOT NULL,
    "nameKanji" TEXT NOT NULL,
    "kanjiLength" INTEGER NOT NULL,
    "romajiSearch" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "operators" TEXT[],
    "lineCount" INTEGER NOT NULL,
    "linesList" TEXT[],
    "passengerRank" INTEGER NOT NULL,
    "passengerTier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);
