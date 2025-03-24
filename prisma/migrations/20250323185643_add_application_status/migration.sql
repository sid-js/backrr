-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "SponsorApplication" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';
