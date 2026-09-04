import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateToken } from "@/lib/tokens";
import { CreatePlanSchema } from "@/lib/validation";
import { serializePlan, serializeParticipant } from "@/lib/serialize";
import { handleApiError } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const body = CreatePlanSchema.parse(await req.json());
    const slug = generateSlug();
    const organizerToken = generateToken();
    const sessionToken = generateToken();

    const plan = await prisma.plan.create({
      data: {
        slug,
        organizerToken,
        title: body.title,
        activity: body.activity,
        date: body.date ?? null,
        time: body.time ?? null,
        groupSizeEstimate: body.groupSizeEstimate ?? null,
        budgetPerPerson: body.budgetPerPerson ?? null,
        initialLocationLabel: body.initialLocationLabel ?? null,
        rerollsAllowed: body.rerollsAllowed ?? 1,
        participants: {
          create: {
            name: body.organizerName,
            isOrganizer: true,
            sessionToken,
          },
        },
      },
      include: { participants: true },
    });

    return NextResponse.json(
      {
        plan: serializePlan(plan),
        organizerToken,
        participant: serializeParticipant(plan.participants[0], sessionToken),
      },
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
