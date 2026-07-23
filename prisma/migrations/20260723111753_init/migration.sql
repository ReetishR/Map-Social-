-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "organizerToken" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "date" TEXT,
    "time" TEXT,
    "groupSizeEstimate" INTEGER,
    "budgetPerPerson" INTEGER,
    "initialLocationLabel" TEXT,
    "responseDeadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'LOBBY',
    "rerollsUsed" INTEGER NOT NULL DEFAULT 0,
    "rerollsAllowed" INTEGER NOT NULL DEFAULT 1,
    "confirmedRecommendationId" TEXT,
    "confirmedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "isOrganizer" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "locationLabel" TEXT,
    "lat" REAL,
    "lng" REAL,
    "privacyLevel" TEXT NOT NULL DEFAULT 'APPROXIMATE_AREA',
    "transportMode" TEXT,
    "altTransportModes" TEXT NOT NULL DEFAULT '[]',
    "maxWalkingMinutes" INTEGER,
    "maxTransfers" INTEGER,
    "maxTravelMinutes" INTEGER,
    "budget" INTEGER,
    "availability" TEXT,
    "preferredCategories" TEXT NOT NULL DEFAULT '[]',
    "cuisine" TEXT NOT NULL DEFAULT '[]',
    "dietary" TEXT NOT NULL DEFAULT '[]',
    "preferences" TEXT NOT NULL DEFAULT '{}',
    "hardConstraints" TEXT NOT NULL DEFAULT '[]',
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Participant_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "generationBatch" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "secondaryLabel" TEXT,
    "venueId" TEXT,
    "venueName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT,
    "neighborhood" TEXT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "priceLevel" INTEGER,
    "estimatedCostPerPerson" INTEGER,
    "rating" REAL,
    "reviewCount" INTEGER,
    "imageUrl" TEXT,
    "vibeTags" TEXT NOT NULL DEFAULT '[]',
    "metroProximityMinutes" INTEGER,
    "parkingAvailable" BOOLEAN,
    "openingHours" TEXT,
    "travelBreakdown" TEXT NOT NULL DEFAULT '[]',
    "avgTravelMinutes" REAL NOT NULL,
    "maxTravelMinutes" REAL NOT NULL,
    "fairnessScore" REAL NOT NULL,
    "groupMatchScore" REAL NOT NULL,
    "scoreBreakdown" TEXT NOT NULL DEFAULT '{}',
    "confidence" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "tradeoff" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recommendation_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "participantName" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_organizerToken_key" ON "Plan"("organizerToken");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_sessionToken_key" ON "Participant"("sessionToken");

-- CreateIndex
CREATE INDEX "Participant_planId_idx" ON "Participant"("planId");

-- CreateIndex
CREATE INDEX "Recommendation_planId_generationBatch_idx" ON "Recommendation"("planId", "generationBatch");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_participantId_key" ON "Vote"("participantId");

-- CreateIndex
CREATE INDEX "Vote_planId_idx" ON "Vote"("planId");

-- CreateIndex
CREATE INDEX "Feedback_planId_idx" ON "Feedback"("planId");
