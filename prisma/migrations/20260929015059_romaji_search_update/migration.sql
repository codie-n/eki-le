/*
  Warnings:

  - The `romajiSearch` column on the `Station` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Station" DROP COLUMN "romajiSearch",
ADD COLUMN     "romajiSearch" TEXT[];
