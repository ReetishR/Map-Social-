"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Input } from "@/components/ui/Input";

function extractSlug(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("plan");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return parts[parts.length - 1] ?? null;
  } catch {
    return trimmed.replace(/^\/*(plan\/)?/, "");
  }
}

export default function JoinPlanPage() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = extractSlug(value);
    if (slug) router.push(`/plan/${slug}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 py-12">
      <Link href="/" className="font-display text-lg font-bold">
        Where<span className="text-gradient">To</span>
      </Link>

      <div>
        <h1 className="font-display text-3xl font-bold">Join a Plan</h1>
        <p className="mt-1 text-text-muted">
          Paste the link someone shared with you, or enter the plan code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Panel className="p-5">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="whereto.app/plan/abcd1234 or abcd1234"
            autoFocus
          />
        </Panel>
        <Button type="submit" size="lg" disabled={!value.trim()}>
          Continue
        </Button>
      </form>
    </div>
  );
}
