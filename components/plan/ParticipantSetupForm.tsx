"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Input } from "@/components/ui/Input";
import { StrengthSelector } from "@/components/plan/StrengthSelector";
import { ACTIVITY_CATEGORIES, TRANSPORT_OPTIONS } from "@/lib/categories";
import { NEIGHBORHOODS, nearestNeighborhood } from "@/lib/venues/neighborhoods";
import { updateParticipant, ApiError } from "@/lib/client/api";
import type { ParticipantDTO, PreferenceStrength, PrivacyLevel, TransportMode } from "@/lib/client/types";

const PRIVACY_OPTIONS: { key: PrivacyLevel; label: string; hint: string }[] = [
  { key: "EXACT_PRIVATE", label: "Private", hint: "Others just see you've joined" },
  { key: "APPROXIMATE_AREA", label: "Approximate area", hint: "Shown as a rough area" },
  { key: "NEIGHBORHOOD", label: "Neighborhood", hint: "Shown as your neighborhood" },
  { key: "LANDMARK", label: "Nearby landmark", hint: "Shown as a nearby landmark" },
];

interface SoftPref {
  value: string | null;
  strength: PreferenceStrength;
}
interface BoolPref {
  strength: PreferenceStrength;
}

export function ParticipantSetupForm({
  slug,
  participant,
  sessionToken,
  showSurpriseCategories,
  onSaved,
}: {
  slug: string;
  participant: ParticipantDTO;
  sessionToken: string;
  showSurpriseCategories: boolean;
  onSaved: () => void;
}) {
  const [locationQuery, setLocationQuery] = useState(participant.locationLabel ?? "");
  const [lat, setLat] = useState<number | null>(participant.lat ?? null);
  const [lng, setLng] = useState<number | null>(participant.lng ?? null);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(participant.privacyLevel);
  const [locating, setLocating] = useState(false);

  const [transportMode, setTransportMode] = useState<TransportMode | null>(
    participant.transportMode ?? "CAR",
  );
  const [altModes, setAltModes] = useState<TransportMode[]>(participant.altTransportModes ?? []);
  const [maxTravelMinutes, setMaxTravelMinutes] = useState(participant.maxTravelMinutes ?? 45);
  const [budget, setBudget] = useState(participant.budget ?? 1000);
  const [availability, setAvailability] = useState(participant.availability ?? "");

  const [preferredCategories, setPreferredCategories] = useState<string[]>(
    participant.preferredCategories ?? [],
  );
  const [cuisineText, setCuisineText] = useState((participant.cuisine ?? []).join(", "));
  const [vegetarian, setVegetarian] = useState((participant.dietary ?? []).includes("vegetarian"));
  const [vegan, setVegan] = useState((participant.dietary ?? []).includes("vegan"));

  const existingPrefs = participant.preferences ?? {};
  const [atmosphere, setAtmosphere] = useState<SoftPref>({
    value: (existingPrefs.atmosphere?.value as string) ?? null,
    strength: existingPrefs.atmosphere?.strength ?? "NONE",
  });
  const [setting, setSetting] = useState<SoftPref>({
    value: (existingPrefs.indoor_outdoor?.value as string) ?? null,
    strength: existingPrefs.indoor_outdoor?.strength ?? "NONE",
  });
  const [novelty, setNovelty] = useState<SoftPref>({
    value: (existingPrefs.novelty_pref?.value as string) ?? null,
    strength: existingPrefs.novelty_pref?.strength ?? "NONE",
  });
  const [parking, setParking] = useState<BoolPref>({ strength: existingPrefs.parking?.strength ?? "NONE" });
  const [metro, setMetro] = useState<BoolPref>({ strength: existingPrefs.metro?.strength ?? "NONE" });
  const [accessibility, setAccessibility] = useState<BoolPref>({
    strength: existingPrefs.accessibility?.strength ?? "NONE",
  });
  const [alcohol, setAlcohol] = useState<BoolPref>({ strength: existingPrefs.alcohol?.strength ?? "NONE" });

  const [avoidNeighborhoods, setAvoidNeighborhoods] = useState<string[]>(() => {
    const hc = (participant.hardConstraints ?? []).find((h) => h.key === "avoid_neighborhoods");
    return Array.isArray(hc?.value) ? (hc!.value as string[]) : [];
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return [];
    return NEIGHBORHOODS.filter((n) => n.name.toLowerCase().includes(q)).slice(0, 5);
  }, [locationQuery]);

  function pickNeighborhood(name: string, nLat: number, nLng: number) {
    setLocationQuery(name);
    setLat(nLat);
    setLng(nLng);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation isn't available on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        const nearest = nearestNeighborhood({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationQuery(nearest.name);
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location. Try searching for your area instead.");
        setLocating(false);
      },
      { timeout: 8000 },
    );
  }

  function toggleAltMode(mode: TransportMode) {
    setAltModes((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]));
  }

  function toggleCategory(key: string) {
    setPreferredCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );
  }

  function toggleAvoidNeighborhood(name: string) {
    setAvoidNeighborhoods((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }

  async function handleReadyUp() {
    if (!lat || !lng) {
      setError("Add a starting location so we can find a fair meeting spot.");
      return;
    }
    setSaving(true);
    setError(null);

    const preferences: Record<string, { value: string | boolean; strength: PreferenceStrength }> = {};
    if (atmosphere.value && atmosphere.strength !== "NONE") preferences.atmosphere = { value: atmosphere.value, strength: atmosphere.strength };
    if (setting.value && setting.strength !== "NONE") preferences.indoor_outdoor = { value: setting.value, strength: setting.strength };
    if (novelty.value && novelty.strength !== "NONE") preferences.novelty_pref = { value: novelty.value, strength: novelty.strength };
    if (parking.strength !== "NONE") preferences.parking = { value: true, strength: parking.strength };
    if (metro.strength !== "NONE") preferences.metro = { value: true, strength: metro.strength };
    if (accessibility.strength !== "NONE") preferences.accessibility = { value: true, strength: accessibility.strength };
    if (alcohol.strength !== "NONE") preferences.alcohol = { value: true, strength: alcohol.strength };

    const dietary = [...(vegetarian ? ["vegetarian"] : []), ...(vegan ? ["vegan"] : [])];
    const cuisine = cuisineText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const hardConstraints = avoidNeighborhoods.length
      ? [{ key: "avoid_neighborhoods", value: avoidNeighborhoods }]
      : [];

    try {
      await updateParticipant(slug, participant.id, sessionToken, {
        locationLabel: locationQuery || null,
        lat,
        lng,
        privacyLevel,
        transportMode,
        altTransportModes: altModes,
        maxTravelMinutes,
        budget,
        availability: availability || null,
        preferredCategories,
        cuisine,
        dietary,
        preferences,
        hardConstraints,
        isReady: true,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save your preferences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Panel className="flex flex-col gap-3 p-5">
        <SectionTitle step={1} title="Choose your starting location" />
        <div className="flex gap-2">
          <Input
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              setLat(null);
              setLng(null);
            }}
            placeholder="Search a neighborhood…"
          />
          <Button type="button" variant="secondary" onClick={useCurrentLocation} disabled={locating}>
            {locating ? "Locating…" : "📍 Use my location"}
          </Button>
        </div>
        {suggestions.length > 0 && !lat && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => pickNeighborhood(s.name, s.lat, s.lng)}
                className="rounded-full border border-border px-3 py-1 text-xs text-text-muted hover:border-purple hover:text-text"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
        {lat && lng && (
          <p className="text-xs text-lime">✓ Location set — used privately to calculate fairness.</p>
        )}

        <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRIVACY_OPTIONS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPrivacyLevel(p.key)}
              className={clsx(
                "rounded-xl border px-2.5 py-2 text-left text-xs transition-colors",
                privacyLevel === p.key
                  ? "border-purple bg-purple/15 text-text"
                  : "border-border text-text-muted hover:border-border-strong",
              )}
            >
              <div className="font-medium">{p.label}</div>
              <div className="text-text-faint">{p.hint}</div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="flex flex-col gap-3 p-5">
        <SectionTitle step={2} title="Transport & travel limit" />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {TRANSPORT_OPTIONS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTransportMode(t.key as TransportMode)}
              className={clsx(
                "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs",
                transportMode === t.key
                  ? "border-purple bg-purple/15 text-text"
                  : "border-border text-text-muted hover:border-border-strong",
              )}
            >
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div>
          <span className="text-xs text-text-muted">Also okay with</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {TRANSPORT_OPTIONS.filter((t) => t.key !== transportMode).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => toggleAltMode(t.key as TransportMode)}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-xs",
                  altModes.includes(t.key as TransportMode)
                    ? "border-cyan text-cyan"
                    : "border-border text-text-muted",
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">
            Maximum travel time: {maxTravelMinutes} min
          </span>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={maxTravelMinutes}
            onChange={(e) => setMaxTravelMinutes(Number(e.target.value))}
            className="accent-purple"
          />
        </label>
      </Panel>

      <Panel className="flex flex-col gap-3 p-5">
        <SectionTitle step={3} title="Budget & availability" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">Budget per person (₹)</span>
            <Input
              type="number"
              min={0}
              step={50}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">Availability (optional)</span>
            <Input
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. after 7pm, not Sundays"
            />
          </label>
        </div>
      </Panel>

      {showSurpriseCategories && (
        <Panel className="flex flex-col gap-3 p-5">
          <SectionTitle step={4} title="What are you in the mood for?" />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {ACTIVITY_CATEGORIES.filter((c) => c.key !== "surprise_me").map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => toggleCategory(c.key)}
                className={clsx(
                  "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs",
                  preferredCategories.includes(c.key)
                    ? "border-purple bg-purple/15 text-text"
                    : "border-border text-text-muted",
                )}
              >
                <span className="text-lg">{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </Panel>
      )}

      <Panel className="flex flex-col gap-4 p-5">
        <SectionTitle step={showSurpriseCategories ? 5 : 4} title="Preferences" />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Cuisine you like (comma separated)</span>
          <Input
            value={cuisineText}
            onChange={(e) => setCuisineText(e.target.value)}
            placeholder="North Indian, Continental"
          />
        </label>

        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={vegetarian} onChange={(e) => setVegetarian(e.target.checked)} />
            Vegetarian required
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={vegan} onChange={(e) => setVegan(e.target.checked)} />
            Vegan required
          </label>
        </div>

        <PrefRow
          label="Atmosphere"
          options={[
            { key: "quiet", label: "Quiet" },
            { key: "lively", label: "Lively" },
          ]}
          selected={atmosphere.value}
          onSelect={(v) => setAtmosphere((p) => ({ ...p, value: v }))}
          strength={atmosphere.strength}
          onStrength={(s) => setAtmosphere((p) => ({ ...p, strength: s }))}
        />
        <PrefRow
          label="Setting"
          options={[
            { key: "indoor", label: "Indoor" },
            { key: "outdoor", label: "Outdoor" },
          ]}
          selected={setting.value}
          onSelect={(v) => setSetting((p) => ({ ...p, value: v }))}
          strength={setting.strength}
          onStrength={(s) => setSetting((p) => ({ ...p, strength: s }))}
        />
        <PrefRow
          label="Novelty"
          options={[
            { key: "familiar", label: "Familiar" },
            { key: "adventurous", label: "Adventurous" },
          ]}
          selected={novelty.value}
          onSelect={(v) => setNovelty((p) => ({ ...p, value: v }))}
          strength={novelty.strength}
          onStrength={(s) => setNovelty((p) => ({ ...p, strength: s }))}
        />

        <BoolPrefRow label="Parking available" pref={parking} onChange={setParking} />
        <BoolPrefRow label="Close to metro" pref={metro} onChange={setMetro} />
        <BoolPrefRow label="Accessible venue" pref={accessibility} onChange={setAccessibility} />
        <BoolPrefRow label="Alcohol served" pref={alcohol} onChange={setAlcohol} />
      </Panel>

      <Panel className="flex flex-col gap-3 p-5">
        <SectionTitle step={showSurpriseCategories ? 6 : 5} title="Anywhere to avoid?" />
        <div className="flex flex-wrap gap-2">
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n.name}
              type="button"
              onClick={() => toggleAvoidNeighborhood(n.name)}
              className={clsx(
                "rounded-full border px-2.5 py-1 text-xs",
                avoidNeighborhoods.includes(n.name)
                  ? "border-red text-red"
                  : "border-border text-text-muted",
              )}
            >
              {n.name}
            </button>
          ))}
        </div>
      </Panel>

      {error && <p className="text-sm text-red">{error}</p>}

      <Button size="lg" onClick={handleReadyUp} disabled={saving} className="w-full">
        {saving ? "Saving…" : "Ready Up ✓"}
      </Button>
    </div>
  );
}

function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple/20 text-xs font-display font-semibold text-purple">
        {step}
      </span>
      <h3 className="font-display text-sm font-semibold">{title}</h3>
    </div>
  );
}

function PrefRow({
  label,
  options,
  selected,
  onSelect,
  strength,
  onStrength,
}: {
  label: string;
  options: { key: string; label: string }[];
  selected: string | null;
  onSelect: (v: string) => void;
  strength: PreferenceStrength;
  onStrength: (s: PreferenceStrength) => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="w-24 text-xs text-text-muted">{label}</span>
        <div className="flex gap-1.5">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => onSelect(o.key)}
              className={clsx(
                "rounded-full border px-2.5 py-1 text-xs",
                selected === o.key ? "border-cyan text-cyan" : "border-border text-text-muted",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <StrengthSelector value={strength} onChange={onStrength} />
    </div>
  );
}

function BoolPrefRow({
  label,
  pref,
  onChange,
}: {
  label: string;
  pref: BoolPref;
  onChange: (p: BoolPref) => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-text-muted">{label}</span>
      <StrengthSelector value={pref.strength} onChange={(s) => onChange({ strength: s })} />
    </div>
  );
}
