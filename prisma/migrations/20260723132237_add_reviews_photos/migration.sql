-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recommendation" (
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
    "editorialSummary" TEXT,
    "mapsUrl" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "reviews" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recommendation_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Recommendation" ("address", "avgTravelMinutes", "category", "confidence", "createdAt", "estimatedCostPerPerson", "explanation", "fairnessScore", "generationBatch", "groupMatchScore", "id", "imageUrl", "label", "lat", "lng", "maxTravelMinutes", "metroProximityMinutes", "neighborhood", "openingHours", "parkingAvailable", "planId", "priceLevel", "rating", "reviewCount", "scoreBreakdown", "secondaryLabel", "tradeoff", "travelBreakdown", "venueId", "venueName", "vibeTags") SELECT "address", "avgTravelMinutes", "category", "confidence", "createdAt", "estimatedCostPerPerson", "explanation", "fairnessScore", "generationBatch", "groupMatchScore", "id", "imageUrl", "label", "lat", "lng", "maxTravelMinutes", "metroProximityMinutes", "neighborhood", "openingHours", "parkingAvailable", "planId", "priceLevel", "rating", "reviewCount", "scoreBreakdown", "secondaryLabel", "tradeoff", "travelBreakdown", "venueId", "venueName", "vibeTags" FROM "Recommendation";
DROP TABLE "Recommendation";
ALTER TABLE "new_Recommendation" RENAME TO "Recommendation";
CREATE INDEX "Recommendation_planId_generationBatch_idx" ON "Recommendation"("planId", "generationBatch");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
