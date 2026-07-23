import { z } from "zod";

export const TransportModeSchema = z.enum([
  "CAR",
  "TWO_WHEELER",
  "AUTO_TAXI",
  "METRO",
  "BUS",
  "WALK",
]);

export const PrivacyLevelSchema = z.enum([
  "EXACT_PRIVATE",
  "APPROXIMATE_AREA",
  "NEIGHBORHOOD",
  "LANDMARK",
]);

export const PreferenceStrengthSchema = z.enum([
  "MUST_HAVE",
  "STRONG",
  "NICE_TO_HAVE",
  "NONE",
]);

export const PreferenceEntrySchema = z.object({
  value: z.union([z.string(), z.boolean()]),
  strength: PreferenceStrengthSchema,
});

export const HardConstraintSchema = z.object({
  key: z.string(),
  value: z.union([z.string(), z.boolean(), z.array(z.string())]),
});

export const CreatePlanSchema = z.object({
  title: z.string().min(1).max(80),
  activity: z.string().min(1).max(40),
  date: z.string().max(20).optional().nullable(),
  time: z.string().max(10).optional().nullable(),
  groupSizeEstimate: z.number().int().min(2).max(30).optional().nullable(),
  budgetPerPerson: z.number().int().min(0).max(200000).optional().nullable(),
  initialLocationLabel: z.string().max(120).optional().nullable(),
  rerollsAllowed: z.number().int().min(0).max(5).optional(),
  organizerName: z.string().min(1).max(40),
});

export const JoinPlanSchema = z.object({
  name: z.string().min(1).max(40),
});

export const UpdateParticipantSchema = z.object({
  name: z.string().min(1).max(40).optional(),
  locationLabel: z.string().max(120).optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  privacyLevel: PrivacyLevelSchema.optional(),
  transportMode: TransportModeSchema.optional().nullable(),
  altTransportModes: z.array(TransportModeSchema).optional(),
  maxWalkingMinutes: z.number().int().min(0).max(120).optional().nullable(),
  maxTransfers: z.number().int().min(0).max(5).optional().nullable(),
  maxTravelMinutes: z.number().int().min(5).max(240).optional().nullable(),
  budget: z.number().int().min(0).max(200000).optional().nullable(),
  availability: z.string().max(200).optional().nullable(),
  preferredCategories: z.array(z.string()).optional(),
  cuisine: z.array(z.string()).optional(),
  dietary: z.array(z.string()).optional(),
  preferences: z.record(z.string(), PreferenceEntrySchema).optional(),
  hardConstraints: z.array(HardConstraintSchema).optional(),
  isReady: z.boolean().optional(),
});

export const GenerateRecommendationsSchema = z.object({
  rerollReason: z.string().max(60).optional(),
});

export const VoteSchema = z.object({
  recommendationId: z.string().min(1),
});

export const ConfirmSchema = z.object({
  recommendationId: z.string().min(1).optional(),
});

export const FeedbackSchema = z.object({
  participantName: z.string().max(40).optional().nullable(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional().nullable(),
});
