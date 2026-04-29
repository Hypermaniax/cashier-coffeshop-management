/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `pin` on the `Users` table. All the data in the column will be lost.
  - Made the column `password` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Users_employeeId_key";

-- DropIndex
DROP INDEX "Users_pin_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "employeeId",
DROP COLUMN "pin",
ALTER COLUMN "password" SET NOT NULL;
