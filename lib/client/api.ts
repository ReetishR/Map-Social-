import type {
  NoResultDTO,
  ParticipantDTO,
  PlanDetailResponse,
  PlanDTO,
  RecommendationDTO,
  VoteDTO,
} from "./types";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { headers?: Record<string, string> },
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error ?? "Something went wrong.", res.status);
  }
  return data as T;
}

export { ApiError };

export interface CreatePlanInput {
  title: string;
  activity: string;
  date?: string | null;
  time?: string | null;
  groupSizeEstimate?: number | null;
  budgetPerPerson?: number | null;
  initialLocationLabel?: string | null;
  rerollsAllowed?: number;
  organizerName: string;
}

export function createPlan(input: CreatePlanInput) {
  return request<{ plan: PlanDTO; organizerToken: string; participant: ParticipantDTO }>(
    "/api/plans",
    { method: "POST", body: JSON.stringify(input) },
  );
}

export function getPlan(slug: string, opts?: { participantToken?: string | null; organizerToken?: string | null }) {
  const headers: Record<string, string> = {};
  if (opts?.participantToken) headers["x-participant-token"] = opts.participantToken;
  if (opts?.organizerToken) headers["x-organizer-token"] = opts.organizerToken;
  return request<PlanDetailResponse>(`/api/plans/${slug}`, { headers });
}

export function joinPlan(slug: string, name: string) {
  return request<{ participant: ParticipantDTO }>(`/api/plans/${slug}/join`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function updateParticipant(
  slug: string,
  participantId: string,
  token: string,
  patch: Record<string, unknown>,
) {
  return request<{ participant: ParticipantDTO }>(
    `/api/plans/${slug}/participants/${participantId}`,
    {
      method: "PATCH",
      headers: { "x-participant-token": token },
      body: JSON.stringify(patch),
    },
  );
}

export function generateRecommendations(slug: string, organizerToken: string, rerollReason?: string) {
  return request<{ recommendations: RecommendationDTO[]; noResult: NoResultDTO | null }>(
    `/api/plans/${slug}/recommendations`,
    {
      method: "POST",
      headers: { "x-organizer-token": organizerToken },
      body: JSON.stringify(rerollReason ? { rerollReason } : {}),
    },
  );
}

export function castVote(slug: string, token: string, recommendationId: string) {
  return request<{ vote: VoteDTO }>(`/api/plans/${slug}/vote`, {
    method: "POST",
    headers: { "x-participant-token": token },
    body: JSON.stringify({ recommendationId }),
  });
}

export function confirmPlan(slug: string, organizerToken: string, recommendationId?: string) {
  return request<{ plan: PlanDTO }>(`/api/plans/${slug}/confirm`, {
    method: "POST",
    headers: { "x-organizer-token": organizerToken },
    body: JSON.stringify(recommendationId ? { recommendationId } : {}),
  });
}

export function submitFeedback(
  slug: string,
  input: { participantName?: string | null; rating: number; comment?: string | null },
) {
  return request<{ feedback: unknown }>(`/api/plans/${slug}/feedback`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
