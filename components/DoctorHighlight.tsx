"use client";

import { Doctor, formatSlot } from "../lib/data";
import { format } from "date-fns";

interface DoctorHighlightProps {
  doctor?: Doctor;
}

export function DoctorHighlight({ doctor }: DoctorHighlightProps) {
  if (!doctor) {
    return (
      <section className="card stack" aria-label="Doctor profile">
        <header>
          <span className="eyebrow">Profile</span>
          <h2 className="headline">Activate a doctor profile</h2>
          <p className="subtext">
            As soon as the agents produce matches, pick one to inspect their bio, care focus, and upcoming windows.
          </p>
        </header>
      </section>
    );
  }

  return (
    <section className="card stack-lg" aria-label="Doctor profile">
      <header className="doctor-top">
        <div className="doctor-meta">
          <span className="badge">Licensed • {doctor.experience}+ yrs experience</span>
          <h2 className="headline" style={{ margin: "0.4rem 0 0" }}>
            {doctor.name}
          </h2>
          <p className="small-muted">Specialty: {doctor.specialty}</p>
        </div>
        <div className="agent-avatar" aria-hidden>
          {doctor.avatarSeed}
        </div>
      </header>

      <p className="subtext" style={{ marginTop: "0" }}>
        {doctor.bio}
      </p>

      <div className="chips">
        {doctor.focus.map((item) => (
          <span className="chip" key={item}>
            {item}
          </span>
        ))}
      </div>

      <div className="panel">
        <strong>Accepted channels</strong>
        <ul className="list-inline" style={{ marginTop: "0.4rem" }}>
          {doctor.acceptedChannels.map((channel) => (
            <li key={channel}>{channel}</li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <strong>Care locations</strong>
        <ul className="stack" style={{ margin: 0 }}>
          {doctor.locations.map((location) => (
            <li className="small-muted" key={location}>
              {location}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel-accent panel">
        <strong>Next openings</strong>
        <ul className="stack" style={{ margin: 0 }}>
          {doctor.slots.slice(0, 5).map((slot) => (
            <li key={slot.start}>{formatSlot(slot)}</li>
          ))}
        </ul>
      </div>

      <div className="small-muted">
        <strong>Average rating:</strong> {doctor.rating.toFixed(2)} · Next available{" "}
        {format(new Date(doctor.nextAvailable), "MMM d, h:mma")}
      </div>
    </section>
  );
}
