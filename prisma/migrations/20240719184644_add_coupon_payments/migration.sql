/*
  Warnings:

  - Added the required column `coupon_id` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_date_to_pay` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "coupon_id" TEXT NOT NULL,
ADD COLUMN     "last_date_to_pay" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
