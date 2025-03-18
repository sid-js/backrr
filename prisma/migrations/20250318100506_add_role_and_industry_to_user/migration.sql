-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SPONSOR', 'CREATOR');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "industry" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CREATOR';
