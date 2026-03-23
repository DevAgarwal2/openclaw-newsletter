-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "htmlUrl" TEXT NOT NULL,
    "aiSummary" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Release_tagName_key" ON "Release"("tagName");

-- CreateIndex
CREATE INDEX "Release_tagName_idx" ON "Release"("tagName");

-- CreateIndex
CREATE INDEX "Release_publishedAt_idx" ON "Release"("publishedAt");
