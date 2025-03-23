/*
  Warnings:

  - You are about to drop the column `audience` on the `SponsorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `SponsorApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SponsorApplication" DROP COLUMN "audience",
DROP COLUMN "socialLinks";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "socialLinks" TEXT[],
ADD COLUMN     "totalAudience" INTEGER NOT NULL DEFAULT 0;
