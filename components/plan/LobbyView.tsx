"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { categoryIcon, categoryLabel } from "@/lib/categories";
import type { NoResultDTO, ParticipantDTO, PlanDTO } from "@/lib/client/types";

export function LobbyView({
  plan,
  participants,
  isOrganizer,
  meId,
  generating,
  noResult,
  onGenerate,
  onEditPreferences,
}: {
  plan: PlanDTO;
  participants: ParticipantDTO[];
  isOrganizer: boolean;
  meId: string;
  generating: boolean;
  noResult: NoResultDTO | null;
  onGenerate: () => void;
  onEditPreferences: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const readyCount = participants.filter((p) => p.isReady).length;
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/plan/${plan.slug}` : "";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const shareText = encodeURIComponent(`Join "${plan.title}" on WhereTo: ${shareUrl}`);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-xs uppercase tracking-wide text-text-muted">Game Lobby</span>
        <h1 className="font-display text-3xl font-bold">
          {categoryIcon(plan.activity)} {plan.title}
        </h1>
        <p className="mt-1 text-text-muted">
          {categoryLabel(plan.activity)}
          {plan.date ? ` · ${plan.date}` : ""}
          {plan.time ? ` at ${plan.time}` : ""}
          {plan.budgetPerPerson ? ` · ~₹${plan.budgetPerPerson}/person` : ""}
        </p>
      </motion.div>

      <Panel className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold">
            {readyCount} of {participants.length} player{participants.length === 1 ? "" : "s"} ready
          </span>
          <Badge accent={readyCount === participants.length ? "lime" : "neutral"}>
            {readyCount === participants.length ? "All ready" : "Waiting…"}
          </Badge>
        </div>
        <ProgressBar value={readyCount} max={Math.max(participants.length, 1)} accent="lime" />

        <div className="flex flex-wrap gap-3">
          {participants.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-1">
              <Avatar name={p.name} ready={p.isReady} />
              <span className="max-w-[4.5rem] truncate text-xs text-text-muted">
                {p.name}
                {p.id === meId ? " (you)" : ""}
              </span>
              {p.isOrganizer && <Badge accent="purple">Host</Badge>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="flex flex-col gap-3 p-5">
        <span className="font-display text-sm font-semibold">Invite your group</span>
        <div className="flex gap-2">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 truncate rounded-xl border border-border bg-bg-elevated px-3 py-2 text-xs text-text-muted"
          />
          <Button size="sm" variant="secondary" onClick={copyLink}>
            {copied ? "Copied ✓" : "Copy link"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-3 py-1.5 text-text-muted hover:border-border-strong hover:text-text"
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Join "${plan.title}" on WhereTo`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-3 py-1.5 text-text-muted hover:border-border-strong hover:text-text"
          >
            Telegram
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(`Join "${plan.title}" on WhereTo`)}&body=${shareText}`}
            className="rounded-full border border-border px-3 py-1.5 text-text-muted hover:border-border-strong hover:text-text"
          >
            Email
          </a>
        </div>
      </Panel>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" onClick={onEditPreferences} className="sm:flex-1">
          Edit my preferences
        </Button>
        {isOrganizer && (
          <Button onClick={onGenerate} disabled={generating} className="sm:flex-1" size="lg">
            {generating ? "Scanning Bangalore…" : "Find Our Spot 🎯"}
          </Button>
        )}
      </div>

      {!isOrganizer && (
        <p className="text-center text-xs text-text-faint">
          Waiting for the host to start the search once everyone&apos;s ready.
        </p>
      )}

      {noResult && (
        <Panel className="flex flex-col gap-2 border-amber/40 p-5">
          <span className="font-display text-sm font-semibold text-amber">{noResult.message}</span>
          <ul className="list-inside list-disc text-sm text-text-muted">
            {noResult.suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
