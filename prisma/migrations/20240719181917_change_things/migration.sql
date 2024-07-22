/*
  Warnings:

  - The values [M,F] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `usedAmount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `first_lastName` on the `UserInfo` table. All the data in the column will be lost.
  - You are about to drop the column `second_lastName` on the `UserInfo` table. All the data in the column will be lost.
  - Added the required column `used_amount` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_last_name` to the `UserInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `second_last_name` to the `UserInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE');
ALTER TABLE "UserInfo" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "usedAmount",
ADD COLUMN     "used_amount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "redeemed_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LearnPost" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "NewsPost" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PostComment" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PostLike" ALTER COLUMN "liked_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "first_lastName",
DROP COLUMN "second_lastName",
ADD COLUMN     "first_last_name" TEXT NOT NULL,
ADD COLUMN     "second_last_name" TEXT NOT NULL;
