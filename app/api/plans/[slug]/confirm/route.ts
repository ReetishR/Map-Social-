import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ConfirmSchema } from "@/lib/validation";
import { serializePlan } from "@/lib/serialize";
import { jsonError, handleApiError } from "@/lib/http";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const organizerToken = req.headers.get("x-organizer-token");
    const body = ConfirmSchema.parse(await req.json().catch(() => ({})));

    const plan = await prisma.plan.findUnique({ where: { slug }, include: { votes: true } });
    if (!plan) return jsonError("Plan not found", 404);
    if (organizerToken !== plan.organizerToken) {
      return jsonError("Only the organizer can confirm the plan.", 403);
    }

    let recommendationId = body.recommendationId ?? null;

    if (!recommendationId) {
      const tally = new Map<string, number>();
      for (const v of plan.votes) tally.set(v.recommendationId, (tally.get(v.recommendationId) ?? 0) + 1);
      if (tally.size === 0) {
        return jsonError("No votes yet — pick a recommendation to confirm.", 409);
      }

      let winnerId: string | null = null;
      let winnerVotes = -1;
      for (const [id, count] of tally) {
        if (count > winnerVotes) {
          winnerVotes = count;
          winnerId = id;
        } else if (count === winnerVotes && winnerId) {
          const [a, b] = await Promise.all([
            prisma.recommendation.findUnique({ where: { id: winnerId } }),
            prisma.recommendation.findUnique({ where: { id } }),
          ]);
          if (a && b && b.groupMatchScore > a.groupMatchScore) winnerId = id;
        }
      }
      recommendationId = winnerId;
    }

    if (!recommendationId) return jsonError("Could not determine a winner.", 409);

    const updated = await prisma.plan.update({
      where: { id: plan.id },
      data: { status: "CONFIRMED", confirmedRecommendationId: recommendationId, confirmedAt: new Date() },
    });

    return NextResponse.json({ plan: serializePlan(updated) });
  } catch (err) {
    return handleApiError(err);
  }
}
