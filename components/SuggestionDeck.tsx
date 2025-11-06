"use client";

import { AgentSuggestion } from "../lib/agent";
import { format } from "date-fns";

interface SuggestionDeckProps {
  suggestions: AgentSuggestion[];
  onFocusDoctor: (doctorId: string) => void;
}

export function SuggestionDeck({ suggestions, onFocusDoctor }: SuggestionDeckProps) {
  if (!suggestions.length) {
    return (
      <section className="card" aria-label="Doctor suggestions">
        <header>
          <span className="eyebrow">Intelligence</span>
          <h2 className="headline">Awaiting agent recommendations</h2>
          <p className="subtext">Dispatch a request to generate curated matches for your care scenario.</p>
        </header>
      </section>
    );
  }

  return (
    <section id="agents" className="card stack-lg" aria-label="Doctor suggestions">
      <header>
        <span className="eyebrow">Agent Picks</span>
        <h2 className="headline">The network recommends these physicians</h2>
        <p className="subtext">
          Agents score doctors on focus fit, experience, satisfaction, and slot alignment. Activate a profile to inspect
          availability and profile notes.
        </p>
      </header>

      <div className="agents-grid">
        {suggestions.map((suggestion) => (
          <article key={suggestion.id} className="agent-card">
            <div className="agent-role">
              <span>🎯</span>
              <strong>{suggestion.doctor.specialty}</strong>
            </div>
            <div>
              <h3>{suggestion.doctor.name}</h3>
              <p>{suggestion.rationale}</p>
            </div>
            <div>
              <div className="tag">Confidence {(suggestion.matchedSlots[0]?.confidence ?? 0.72 * 100).toFixed(0)}%</div>
            </div>
            <div className="panel">
              <strong>Smart holds</strong>
              <ul className="list-inline" style={{ marginTop: "0.4rem" }}>
                {suggestion.matchedSlots.map((slot) => (
                  <li key={slot.start}>{format(new Date(slot.start), "MMM d • h:mma")}</li>
                ))}
              </ul>
            </div>
            <button className="btn btn-secondary" type="button" onClick={() => onFocusDoctor(suggestion.doctor.id)}>
              Inspect profile
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
