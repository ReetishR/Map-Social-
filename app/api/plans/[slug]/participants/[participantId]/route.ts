import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateParticipantSchema } from "@/lib/validation";
import { serializeParticipant } from "@/lib/serialize";
import { jsonError, handleApiError } from "@/lib/http";

const SCALAR_FIELDS = [
  "name",
  "locationLabel",
  "lat",
  "lng",
  "privacyLevel",
  "transportMode",
  "maxWalkingMinutes",
  "maxTransfers",
  "maxTravelMinutes",
  "budget",
  "availability",
  "isReady",
] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; participantId: string }> },
) {
  try {
    const { slug, participantId } = await params;
    const token = req.headers.get("x-participant-token");
    if (!token) return jsonError("Missing participant token", 401);

    const body = UpdateParticipantSchema.parse(await req.json());

    const plan = await prisma.plan.findUnique({ where: { slug } });
    if (!plan) return jsonError("Plan not found", 404);

    const participant = await prisma.participant.findUnique({ where: { id: participantId } });
    if (!participant || participant.planId !== plan.id) return jsonError("Participant not found", 404);
    if (participant.sessionToken !== token) return jsonError("Not authorized", 403);

    const data: Record<string, unknown> = {};
    for (const key of SCALAR_FIELDS) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    if (body.altTransportModes !== undefined) data.altTransportModes = JSON.stringify(body.altTransportModes);
    if (body.preferredCategories !== undefined) data.preferredCategories = JSON.stringify(body.preferredCategories);
    if (body.cuisine !== undefined) data.cuisine = JSON.stringify(body.cuisine);
    if (body.dietary !== undefined) data.dietary = JSON.stringify(body.dietary);
    if (body.preferences !== undefined) data.preferences = JSON.stringify(body.preferences);
    if (body.hardConstraints !== undefined) data.hardConstraints = JSON.stringify(body.hardConstraints);

    const updated = await prisma.participant.update({ where: { id: participantId }, data });
    return NextResponse.json({ participant: serializeParticipant(updated, token) });
  } catch (err) {
    return handleApiError(err);
  }
}
