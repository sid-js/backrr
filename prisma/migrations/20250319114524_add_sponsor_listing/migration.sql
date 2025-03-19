/*
  Warnings:

  - You are about to drop the `Listing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Listing";

-- CreateTable
CREATE TABLE "SponsorListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "targetAudienceSize" INTEGER NOT NULL,
    "industry" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "SponsorListing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SponsorListing" ADD CONSTRAINT "SponsorListing_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
