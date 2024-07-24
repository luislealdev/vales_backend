/*
  Warnings:

  - You are about to drop the column `coupon_type_id` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the `CouponType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_coupon_type_id_fkey";

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "coupon_type_id";

-- DropTable
DROP TABLE "CouponType";
