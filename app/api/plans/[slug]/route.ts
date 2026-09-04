import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  serializePlan,
  serializeParticipant,
  serializeRecommendation,
  serializeVote,
} from "@/lib/serialize";
import { jsonError, handleApiError } from "@/lib/http";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const requesterToken = req.headers.get("x-participant-token");

    const plan = await prisma.plan.findUnique({
      where: { slug },
      include: {
        participants: { orderBy: { joinedAt: "asc" } },
        votes: true,
      },
    });
    if (!plan) return jsonError("Plan not found", 404);

    const isOrganizer = req.headers.get("x-organizer-token") === plan.organizerToken;

    let recommendations: Awaited<ReturnType<typeof prisma.recommendation.findMany>> = [];
    if (plan.status === "REVIEWING" || plan.status === "CONFIRMED") {
      const latestBatch = await prisma.recommendation.aggregate({
        where: { planId: plan.id },
        _max: { generationBatch: true },
      });
      if (latestBatch._max.generationBatch != null) {
        recommendations = await prisma.recommendation.findMany({
          where: { planId: plan.id, generationBatch: latestBatch._max.generationBatch },
        });
      }
    }

    return NextResponse.json({
      plan: serializePlan(plan),
      isOrganizer,
      participants: plan.participants.map((p) => serializeParticipant(p, requesterToken)),
      recommendations: recommendations.map(serializeRecommendation),
      votes: plan.votes.map(serializeVote),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
