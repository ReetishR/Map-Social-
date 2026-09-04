-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('LOBBY', 'GENERATING', 'REVIEWING', 'VOTING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PrivacyLevel" AS ENUM ('EXACT_PRIVATE', 'APPROXIMATE_AREA', 'NEIGHBORHOOD', 'LANDMARK');

-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('CAR', 'TWO_WHEELER', 'AUTO_TAXI', 'METRO', 'BUS', 'WALK');

-- CreateEnum
CREATE TYPE "RecommendationLabel" AS ENUM ('BEST_OVERALL', 'MOST_CONVENIENT', 'WILD_CARD', 'BEST_VALUE', 'FAIREST_COMMUTE', 'HIDDEN_GEM');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "organizerToken" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "date" TEXT,
    "time" TEXT,
    "groupSizeEstimate" INTEGER,
    "budgetPerPerson" INTEGER,
    "initialLocationLabel" TEXT,
    "responseDeadline" TIMESTAMP(3),
    "status" "PlanStatus" NOT NULL DEFAULT 'LOBBY',
    "rerollsUsed" INTEGER NOT NULL DEFAULT 0,
    "rerollsAllowed" INTEGER NOT NULL DEFAULT 1,
    "confirmedRecommendationId" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "isOrganizer" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "locationLabel" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "privacyLevel" "PrivacyLevel" NOT NULL DEFAULT 'APPROXIMATE_AREA',
    "transportMode" "TransportMode",
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
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "generationBatch" INTEGER NOT NULL,
    "label" "RecommendationLabel" NOT NULL,
    "secondaryLabel" TEXT,
    "venueId" TEXT,
    "venueName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT,
    "neighborhood" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "priceLevel" INTEGER,
    "estimatedCostPerPerson" INTEGER,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "imageUrl" TEXT,
    "vibeTags" TEXT NOT NULL DEFAULT '[]',
    "metroProximityMinutes" INTEGER,
    "parkingAvailable" BOOLEAN,
    "openingHours" TEXT,
    "travelBreakdown" TEXT NOT NULL DEFAULT '[]',
    "avgTravelMinutes" DOUBLE PRECISION NOT NULL,
    "maxTravelMinutes" DOUBLE PRECISION NOT NULL,
    "fairnessScore" DOUBLE PRECISION NOT NULL,
    "groupMatchScore" DOUBLE PRECISION NOT NULL,
    "scoreBreakdown" TEXT NOT NULL DEFAULT '{}',
    "confidence" "ConfidenceLevel" NOT NULL,
    "explanation" TEXT NOT NULL,
    "tradeoff" TEXT,
    "editorialSummary" TEXT,
    "mapsUrl" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "reviews" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "participantName" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
