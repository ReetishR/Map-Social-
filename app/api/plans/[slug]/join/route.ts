import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { JoinPlanSchema } from "@/lib/validation";
import { serializeParticipant } from "@/lib/serialize";
import { jsonError, handleApiError } from "@/lib/http";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = JoinPlanSchema.parse(await req.json());

    const plan = await prisma.plan.findUnique({ where: { slug } });
    if (!plan) return jsonError("Plan not found", 404);
    if (plan.status === "CONFIRMED" || plan.status === "CANCELLED") {
      return jsonError("This plan is no longer accepting participants.", 409);
    }

    const sessionToken = generateToken();
    const participant = await prisma.participant.create({
      data: { planId: plan.id, name: body.name, sessionToken },
    });

    return NextResponse.json(
      { participant: serializeParticipant(participant, sessionToken) },
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
