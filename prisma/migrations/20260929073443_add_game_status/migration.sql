-- CreateTable
CREATE TABLE "GameStatus" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "currentDayIndex" INTEGER NOT NULL DEFAULT 1,
    "lastUpdatedDate" TEXT NOT NULL,

    CONSTRAINT "GameStatus_pkey" PRIMARY KEY ("id")
);
