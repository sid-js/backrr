-- CreateTable
CREATE TABLE "SponsorApplication" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "audience" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "socialLinks" TEXT[],

    CONSTRAINT "SponsorApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SponsorApplication" ADD CONSTRAINT "SponsorApplication_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "SponsorListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorApplication" ADD CONSTRAINT "SponsorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
