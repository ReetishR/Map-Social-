import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FeedbackSchema } from "@/lib/validation";
import { serializeFeedback } from "@/lib/serialize";
import { jsonError, handleApiError } from "@/lib/http";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = FeedbackSchema.parse(await req.json());

    const plan = await prisma.plan.findUnique({ where: { slug } });
    if (!plan) return jsonError("Plan not found", 404);

    const feedback = await prisma.feedback.create({
      data: {
        planId: plan.id,
        participantName: body.participantName ?? null,
        rating: body.rating,
        comment: body.comment ?? null,
      },
    });

    return NextResponse.json({ feedback: serializeFeedback(feedback) }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
