-- CreateTable
CREATE TABLE "LeadStatus" (
    "leadId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadStatus_pkey" PRIMARY KEY ("leadId")
);
