"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Input } from "@/components/ui/Input";
import { ACTIVITY_CATEGORIES } from "@/lib/categories";
import { createPlan, ApiError } from "@/lib/client/api";
import { saveIdentity } from "@/lib/client/storage";

export default function CreatePlanPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [activity, setActivity] = useState("restaurant");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [groupSize, setGroupSize] = useState(4);
  const [budget, setBudget] = useState<string>("1000");
  const [initialLocationLabel, setInitialLocationLabel] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !organizerName.trim()) {
      setError("Give your plan a title and tell us your name.");
      return;
    }
    setSubmitting(true);
    try {
      const { plan, organizerToken, participant } = await createPlan({
        title: title.trim(),
        activity,
        date: date || null,
        time: time || null,
        groupSizeEstimate: groupSize,
        budgetPerPerson: budget ? Number(budget) : null,
        initialLocationLabel: initialLocationLabel || null,
        organizerName: organizerName.trim(),
      });
      saveIdentity(plan.slug, {
        participantId: participant.id,
        sessionToken: participant.sessionToken!,
        organizerToken,
      });
      router.push(`/plan/${plan.slug}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create the plan. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold">
          Where<span className="text-gradient">To</span>
        </Link>
        <span className="text-xs text-text-muted">Starting a new lobby</span>
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold">Create a Plan</h1>
        <p className="mt-1 text-text-muted">
          Set the basics — your group will fill in the rest privately once they join.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Panel className="flex flex-col gap-5 p-6">
          <Field label="Plan title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Friday Night Drinks"
              maxLength={80}
            />
          </Field>

          <Field label="Your name">
            <Input
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder="Asha"
              maxLength={40}
            />
          </Field>

          <FieldGroup label="Activity">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {ACTIVITY_CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setActivity(c.key)}
                  className={clsx(
                    "flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs transition-colors",
                    activity === c.key
                      ? "border-purple bg-purple/15 text-text"
                      : "border-border text-text-muted hover:border-border-strong",
                  )}
                >
                  <span className="text-xl">{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </FieldGroup>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date (optional)">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Time (optional)">
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Group size">
              <Input
                type="number"
                min={2}
                max={30}
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
              />
            </Field>
            <Field label="Budget per person (₹)">
              <Input
                type="number"
                min={0}
                step={50}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Starting area (optional)">
            <Input
              value={initialLocationLabel}
              onChange={(e) => setInitialLocationLabel(e.target.value)}
              placeholder="e.g. somewhere central, or a rough side of town"
              maxLength={120}
            />
          </Field>
        </Panel>

        {error && <p className="text-sm text-red">{error}</p>}

        <Button type="submit" size="lg" disabled={submitting} className="w-full">
          {submitting ? "Creating lobby…" : "Create Lobby"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      {children}
    </label>
  );
}

// A <label> must wrap a single form control — using it around a whole button
// grid would let the browser fold every button's text into one accessible
// name. This variant is a plain div for grouping multi-button choices.
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      {children}
    </div>
  );
}
