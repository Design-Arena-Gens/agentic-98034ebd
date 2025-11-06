"use client";

import { Appointment, findDoctorById, formatSlot } from "../lib/data";

interface AppointmentTimelineProps {
  appointments: Appointment[];
}

export function AppointmentTimeline({ appointments }: AppointmentTimelineProps) {
  if (!appointments.length) {
    return (
      <section id="timeline" className="card">
        <header>
          <span className="eyebrow">Upcoming</span>
          <h2 className="headline">No appointments yet</h2>
          <p className="subtext">Dispatch a request to let the agents orchestrate your next visit.</p>
        </header>
      </section>
    );
  }

  return (
    <section id="timeline" className="card stack-lg">
      <header>
        <span className="eyebrow">Timeline</span>
        <h2 className="headline">Agent-managed bookings</h2>
        <p className="subtext">
          Confirmed appointments sync to your mobile app and calendar. Pending items remain on agent watchlists until
          they receive confirmation.
        </p>
      </header>

      <div className="timeline">
        {appointments.map((appointment) => {
          const doctor = findDoctorById(appointment.doctorId);
          if (!doctor) return null;
          return (
            <article key={appointment.id} className="timeline-card">
              <div className="timeline-header">
                <div>
                  <div className="timeline-doctor">{doctor.name}</div>
                  <div className="small-muted">{doctor.specialty}</div>
                </div>
                <div className={`status-pill ${appointment.status === "Pending" ? "pending" : ""}`}>
                  {appointment.status === "Pending" ? "Awaiting confirmation" : "Confirmed"}
                </div>
              </div>
              <div className="inline small-muted">
                <span>📅</span>
                <strong>{formatSlot({ start: appointment.start, end: appointment.end })}</strong>
              </div>
              <div className="inline small-muted">
                <span>📍</span>
                <span>{appointment.channel}</span>
              </div>
              <p className="small-muted">Reason: {appointment.reason}</p>
              {appointment.meta && (
                <div className="panel">
                  {Object.entries(appointment.meta).map(([label, message]) => (
                    <p className="small-muted" key={label} style={{ margin: "0.2rem 0" }}>
                      <strong>{label}:</strong> {message}
                    </p>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
