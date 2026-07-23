import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GenerateRecommendationsSchema } from "@/lib/validation";
import { serializeRecommendation } from "@/lib/serialize";
import { jsonError, handleApiError } from "@/lib/http";
import { generateRecommendations } from "@/lib/recommendation/engine";
import { toParticipantInput } from "@/lib/recommendation/adapt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const organizerToken = req.headers.get("x-organizer-token");
    const body = GenerateRecommendationsSchema.parse(await req.json().catch(() => ({})));

    const plan = await prisma.plan.findUnique({ where: { slug }, include: { participants: true } });
    if (!plan) return jsonError("Plan not found", 404);
    if (organizerToken !== plan.organizerToken) return jsonError("Only the organizer can do this.", 403);
    if (plan.status === "CONFIRMED" || plan.status === "CANCELLED") {
      return jsonError("This plan is already finalized.", 409);
    }

    const isReroll = Boolean(body.rerollReason);
    if (isReroll && plan.rerollsUsed >= plan.rerollsAllowed) {
      return jsonError("No rerolls remaining for this plan.", 409);
    }

    const priorBatchAgg = await prisma.recommendation.aggregate({
      where: { planId: plan.id },
      _max: { generationBatch: true },
    });
    const nextBatch = (priorBatchAgg._max.generationBatch ?? 0) + 1;

    let excludeVenueIds: string[] = [];
    if (isReroll && priorBatchAgg._max.generationBatch != null) {
      const priorRecs = await prisma.recommendation.findMany({
        where: { planId: plan.id, generationBatch: priorBatchAgg._max.generationBatch },
        select: { venueId: true },
      });
      excludeVenueIds = priorRecs.map((r) => r.venueId).filter((x): x is string => Boolean(x));
    }

    const participantInputs = plan.participants.map(toParticipantInput);

    const result = await generateRecommendations(participantInputs, {
      activity: plan.activity,
      time: plan.time,
      budgetPerPerson: plan.budgetPerPerson,
      rerollReason: body.rerollReason,
      excludeVenueIds,
    });

    if (result.recommendations.length === 0) {
      return NextResponse.json({ recommendations: [], noResult: result.noResult });
    }

    await prisma.$transaction([
      ...(isReroll
        ? [prisma.plan.update({ where: { id: plan.id }, data: { rerollsUsed: { increment: 1 } } })]
        : []),
      prisma.plan.update({ where: { id: plan.id }, data: { status: "REVIEWING" } }),
      ...result.recommendations.map((rec) =>
        prisma.recommendation.create({
          data: {
            planId: plan.id,
            generationBatch: nextBatch,
            label: rec.label,
            venueId: rec.venueId,
            venueName: rec.venueName,
            category: rec.category,
            address: rec.address,
            neighborhood: rec.neighborhood,
            lat: rec.lat,
            lng: rec.lng,
            priceLevel: rec.priceLevel,
            estimatedCostPerPerson: rec.estimatedCostPerPerson,
            rating: rec.rating,
            reviewCount: rec.reviewCount,
            imageUrl: rec.imageUrl,
            vibeTags: JSON.stringify(rec.vibeTags),
            metroProximityMinutes: rec.metroProximityMinutes,
            parkingAvailable: rec.parkingAvailable,
            openingHours: rec.openingHours,
            travelBreakdown: JSON.stringify(rec.travelBreakdown),
            avgTravelMinutes: rec.avgTravelMinutes,
            maxTravelMinutes: rec.maxTravelMinutes,
            fairnessScore: rec.fairnessScore,
            groupMatchScore: rec.groupMatchScore,
            scoreBreakdown: JSON.stringify(rec.scoreBreakdown),
            confidence: rec.confidence,
            explanation: rec.explanation,
            tradeoff: rec.tradeoff,
          },
        }),
      ),
    ]);

    const recs = await prisma.recommendation.findMany({
      where: { planId: plan.id, generationBatch: nextBatch },
    });

    return NextResponse.json({ recommendations: recs.map(serializeRecommendation), noResult: null });
  } catch (err) {
    return handleApiError(err);
  }
}
