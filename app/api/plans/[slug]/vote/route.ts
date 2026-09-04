import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VoteSchema } from "@/lib/validation";
import { serializeVote } from "@/lib/serialize";
import { jsonError, handleApiError } from "@/lib/http";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const token = req.headers.get("x-participant-token");
    if (!token) return jsonError("Missing participant token", 401);

    const body = VoteSchema.parse(await req.json());

    const plan = await prisma.plan.findUnique({ where: { slug } });
    if (!plan) return jsonError("Plan not found", 404);
    if (plan.status === "CONFIRMED" || plan.status === "CANCELLED") {
      return jsonError("Voting is closed for this plan.", 409);
    }

    const participant = await prisma.participant.findFirst({
      where: { planId: plan.id, sessionToken: token },
    });
    if (!participant) return jsonError("Not authorized", 403);

    const recommendation = await prisma.recommendation.findUnique({
      where: { id: body.recommendationId },
    });
    if (!recommendation || recommendation.planId !== plan.id) {
      return jsonError("Recommendation not found", 404);
    }

    const vote = await prisma.vote.upsert({
      where: { participantId: participant.id },
      update: { recommendationId: recommendation.id },
      create: { planId: plan.id, participantId: participant.id, recommendationId: recommendation.id },
    });

    return NextResponse.json({ vote: serializeVote(vote) });
  } catch (err) {
    return handleApiError(err);
  }
}
