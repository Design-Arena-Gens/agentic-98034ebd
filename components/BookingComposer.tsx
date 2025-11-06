"use client";

import { FormEvent, useMemo, useState } from "react";
import { BookingPreferences } from "../lib/agent";
import { DoctorSpecialty } from "../lib/data";

interface BookingComposerProps {
  preferences: BookingPreferences;
  onPrefChange: (updates: Partial<BookingPreferences>) => void;
  onCompose: (payload: { message: string; overrides?: Partial<BookingPreferences> }) => void;
}

const availableSpecialties: DoctorSpecialty[] = [
  "Primary Care",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics"
];

const urgencyOptions = ["Routine", "Soon", "Urgent"] as const;

export function BookingComposer({ preferences, onPrefChange, onCompose }: BookingComposerProps) {
  const [notes, setNotes] = useState("");

  const draftMessage = useMemo(() => {
    const parts = [
      "Please coordinate a doctor visit.",
      preferences.specialty && `Specialty focus: ${preferences.specialty}.`,
      preferences.channel && `Channel preference: ${preferences.channel}.`,
      preferences.urgency && `Urgency level: ${preferences.urgency}.`,
      preferences.dateFlexibility && `Prefer ${preferences.dateFlexibility.toLowerCase()}.`,
      notes && `Context: ${notes}`
    ]
      .filter(Boolean)
      .join(" ");
    return parts || "Coordinate a doctor visit soon.";
  }, [preferences, notes]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onCompose({
      message: draftMessage,
      overrides: { symptoms: notes }
    });
    setNotes("");
  };

  return (
    <section id="book" className="card stack-lg" aria-label="Booking composer">
      <header>
        <span className="eyebrow">Launch Request</span>
        <h2 className="headline">Hand the case to the scheduling agents</h2>
        <p className="subtext">
          Outline symptoms, urgency, and preferences. Triage AI will route the signal, Matchmaker AI finds doctors,
          Scheduling AI blocks time, and Concierge AI confirms logistics.
        </p>
      </header>

      <form className="form-grid stack" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="symptoms">Symptoms or visit goals</label>
          <textarea
            id="symptoms"
            className="input"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Example: Ongoing heart palpitations, looking for earlier cardio follow-up."
          />
        </div>

        <div className="grid-2">
          <div className="form-row">
            <label htmlFor="specialty">Priority specialty</label>
            <select
              id="specialty"
              className="select"
              value={preferences.specialty ?? ""}
              onChange={(event) =>
                onPrefChange({ specialty: event.target.value ? (event.target.value as DoctorSpecialty) : undefined })
              }
            >
              <option value="">Let agents decide</option>
              {availableSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="urgency">Urgency</label>
            <select
              id="urgency"
              className="select"
              value={preferences.urgency ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                onPrefChange({
                  urgency: value ? (value as (typeof urgencyOptions)[number]) : undefined
                });
              }}
            >
              <option value="">Routine</option>
              {urgencyOptions.map((urgency) => (
                <option key={urgency} value={urgency}>
                  {urgency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-row">
            <label htmlFor="channel">Visit channel</label>
            <select
              id="channel"
              className="select"
              value={preferences.channel ?? ""}
              onChange={(event) =>
                onPrefChange({
                  channel: event.target.value ? (event.target.value as BookingPreferences["channel"]) : undefined
                })
              }
            >
              <option value="">Either in-person or virtual</option>
              <option value="In-person">In-person</option>
              <option value="Virtual">Virtual</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="time">Time of day</label>
            <select
              id="time"
              className="select"
              value={preferences.dateFlexibility ?? ""}
              onChange={(event) =>
                onPrefChange({
                  dateFlexibility: event.target.value
                    ? (event.target.value as BookingPreferences["dateFlexibility"])
                    : undefined
                })
              }
            >
              <option value="">No preference</option>
              <option value="Mornings">Mornings</option>
              <option value="Afternoons">Afternoons</option>
              <option value="Evenings">Evenings</option>
            </select>
          </div>
        </div>

        <div className="inline-actions">
          <button className="btn" type="submit">
            Engage agents with this brief
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              onPrefChange({});
              setNotes("");
            }}
          >
            Reset brief
          </button>
        </div>
      </form>

      <div className="panel-accent panel">
        <strong>Agent dispatch preview</strong>
        <p className="small-muted" style={{ marginTop: "0.35rem" }}>
          {draftMessage}
        </p>
      </div>
    </section>
  );
}
