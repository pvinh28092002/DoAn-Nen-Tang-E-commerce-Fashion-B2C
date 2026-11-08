/*
  Warnings:

  - Made the column `ward` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "ward" SET NOT NULL;
