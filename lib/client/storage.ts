"use client";

export interface StoredIdentity {
  participantId: string;
  sessionToken: string;
  organizerToken?: string;
}

function key(slug: string): string {
  return `whereto:${slug}`;
}

export function loadIdentity(slug: string): StoredIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(slug));
    return raw ? (JSON.parse(raw) as StoredIdentity) : null;
  } catch {
    return null;
  }
}

export function saveIdentity(slug: string, identity: StoredIdentity): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key(slug), JSON.stringify(identity));
}

export function clearIdentity(slug: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key(slug));
}
