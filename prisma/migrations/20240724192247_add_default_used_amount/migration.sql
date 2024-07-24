/*
  Warnings:

  - Made the column `used_amount` on table `Coupon` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "used_amount" SET NOT NULL,
ALTER COLUMN "used_amount" SET DEFAULT 0;
