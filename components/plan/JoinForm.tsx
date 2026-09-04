"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Input } from "@/components/ui/Input";
import { ApiError, joinPlan } from "@/lib/client/api";
import { saveIdentity } from "@/lib/client/storage";
import type { PlanDTO } from "@/lib/client/types";
import { categoryIcon } from "@/lib/categories";

export function JoinForm({
  slug,
  plan,
  onJoined,
}: {
  slug: string;
  plan?: PlanDTO;
  onJoined: () => void;
}) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const { participant } = await joinPlan(slug, name.trim());
      saveIdentity(slug, { participantId: participant.id, sessionToken: participant.sessionToken! });
      onJoined();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not join this plan.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-xs text-text-muted">You&apos;ve been invited to</span>
        <h1 className="font-display text-3xl font-bold">
          {plan ? (
            <>
              {categoryIcon(plan.activity)} {plan.title}
            </>
          ) : (
            "a WhereTo plan"
          )}
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Panel className="p-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">Your name</span>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should the group call you?"
              maxLength={40}
            />
          </label>
        </Panel>
        {error && <p className="text-sm text-red">{error}</p>}
        <Button type="submit" size="lg" disabled={!name.trim() || submitting}>
          {submitting ? "Joining…" : "Join the Lobby"}
        </Button>
      </form>
      <p className="text-center text-xs text-text-faint">
        No account needed. Your exact location stays private by default.
      </p>
    </div>
  );
}
