/*
  Warnings:

  - A unique constraint covering the columns `[pin]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_pin_key" ON "Users"("pin");
