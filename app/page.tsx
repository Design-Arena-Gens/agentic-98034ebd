"use client";

import { useEffect, useMemo, useState } from "react";
import { AgentChat } from "../components/AgentChat";
import { BookingComposer } from "../components/BookingComposer";
import { SuggestionDeck } from "../components/SuggestionDeck";
import { DoctorHighlight } from "../components/DoctorHighlight";
import { AppointmentTimeline } from "../components/AppointmentTimeline";
import { MetricsRow } from "../components/MetricsRow";
import {
  AgentMessage,
  AgentState,
  BookingPreferences,
  initializeAgentState,
  runAgentPipeline
} from "../lib/agent";
import { Appointment, findDoctorById, seedAppointments } from "../lib/data";
import { formatDistanceToNow } from "date-fns";

export default function HomePage() {
  const [agentState, setAgentState] = useState<AgentState>(() => initializeAgentState());
  const [appointments, setAppointments] = useState<Appointment[]>(() => [...seedAppointments]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedDoctorId, setFocusedDoctorId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (agentState.suggestions.length > 0) {
      setFocusedDoctorId(agentState.suggestions[0].doctor.id);
    } else {
      setFocusedDoctorId(undefined);
    }
  }, [agentState.suggestions]);

  const handleAgentInput = (message: string, overrides?: Partial<BookingPreferences>) => {
    setIsProcessing(true);
    setAgentState((previous) => {
      const workingState: AgentState = {
        preferences: { ...previous.preferences, ...overrides },
        suggestions: [...previous.suggestions],
        transcript: [...previous.transcript],
        draftedAppointment: previous.draftedAppointment ? { ...previous.draftedAppointment } : undefined
      };

      const userMessage: AgentMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: message,
        timestamp: new Date().toISOString()
      };

      workingState.transcript.push(userMessage);

      const { state } = runAgentPipeline(message, workingState);
      return { ...state };
    });
    setIsProcessing(false);
  };

  const confirmDraftAppointment = () => {
    if (!agentState.draftedAppointment) return;
    const confirmedAppointment: Appointment = {
      ...agentState.draftedAppointment,
      id: `apt-${Math.random().toString(36).slice(2, 8)}`,
      status: "Confirmed"
    };
    setAppointments((current) => [confirmedAppointment, ...current]);
    setAgentState((current) => ({
      ...current,
      draftedAppointment: undefined,
      transcript: [
        ...current.transcript,
        {
          id: `concierge-confirm-${Date.now()}`,
          role: "Concierge AI",
          timestamp: new Date().toISOString(),
          text: "🤝 Appointment locked on the provider schedule and synced to patient calendar."
        }
      ]
    }));
  };

  const metrics = useMemo(
    () => [
      {
        label: "Agent Matches",
        value: agentState.suggestions.length ? agentState.suggestions.length.toString() : "—",
        description: "Number of doctors the AI composite agent has shortlisted."
      },
      {
        label: "Held Slots",
        value: agentState.draftedAppointment ? "1" : "0",
        description: "Reservable windows actively held for you."
      },
      {
        label: "Upcoming Visits",
        value: appointments.length.toString(),
        description: "Confirmed or pending appointments managed in the timeline."
      },
      {
        label: "Last Agent Run",
        value: agentState.transcript.length
          ? formatDistanceToNow(new Date(agentState.transcript.slice(-1)[0].timestamp), { addSuffix: false })
          : "—",
        description: "Time since the most recent agent response."
      }
    ],
    [agentState.suggestions.length, agentState.draftedAppointment, appointments.length, agentState.transcript]
  );

  const focusedDoctor = focusedDoctorId ? findDoctorById(focusedDoctorId) : undefined;

  return (
    <div className="stack-lg">
      <section className="card stack-lg" style={{ textAlign: "left" }}>
        <span className="eyebrow">Agentic Care OS</span>
        <h2 className="headline">Doctor appointments, orchestrated by collaborating AI agents</h2>
        <p className="subtext">
          AstraCare coordinates care using autonomous AI teammates. Describe your need once: the Triage agent captures
          context, Matchmaker agent finds the right physicians, Scheduling agent holds optimal slots, and Concierge agent
          handles confirmations.
        </p>
        <div className="chips">
          <span className="chip">Triage AI</span>
          <span className="chip">Matchmaker AI</span>
          <span className="chip">Scheduling AI</span>
          <span className="chip">Concierge AI</span>
        </div>
      </section>

      <MetricsRow metrics={metrics} />

      <div className="grid-2">
        <BookingComposer
          preferences={agentState.preferences}
          onPrefChange={(updates) => {
            setAgentState((current) => ({
              ...current,
              preferences: Object.keys(updates).length ? { ...current.preferences, ...updates } : {}
            }));
          }}
          onCompose={({ message, overrides }) => handleAgentInput(message, overrides)}
        />

        <AgentChat transcript={agentState.transcript} onSend={(message) => handleAgentInput(message)} isProcessing={isProcessing} />
      </div>

      <SuggestionDeck
        suggestions={agentState.suggestions}
        onFocusDoctor={(doctorId) => setFocusedDoctorId(doctorId)}
      />

      <div className="grid-2">
        <DoctorHighlight doctor={focusedDoctor} />
        <section className="card stack-lg">
          <header>
            <span className="eyebrow">Draft Hold</span>
            <h2 className="headline">Agent-held appointment</h2>
            <p className="subtext">
              Scheduling AI can pause a slot before it disappears. Confirm to solidify the booking, or dispatch a new
              instruction for alternative options.
            </p>
          </header>

          {agentState.draftedAppointment ? (
            <div className="panel stack">
              <strong>Draft with {findDoctorById(agentState.draftedAppointment.doctorId)?.name}</strong>
              <span className="small-muted">
                {agentState.draftedAppointment.channel} • {agentState.draftedAppointment.reason}
              </span>
              <span className="small-muted">
                {new Intl.DateTimeFormat("en", {
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit"
                }).format(new Date(agentState.draftedAppointment.start))}
              </span>
              <button className="btn" type="button" onClick={confirmDraftAppointment}>
                Confirm this appointment
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <p>No draft on hold currently. Ask the agents to locate something new.</p>
            </div>
          )}
        </section>
      </div>

      <AppointmentTimeline appointments={appointments} />
    </div>
  );
}
