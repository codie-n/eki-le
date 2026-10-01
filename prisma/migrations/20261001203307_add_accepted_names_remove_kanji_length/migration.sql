/*
  Warnings:

  - You are about to drop the column `kanjiLength` on the `Station` table. All the data in the column will be lost.
  - You are about to drop the column `romajiSearch` on the `Station` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Station" DROP COLUMN "kanjiLength",
DROP COLUMN "romajiSearch",
ADD COLUMN     "acceptedNames" TEXT[];
