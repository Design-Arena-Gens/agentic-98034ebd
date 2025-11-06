"use client";

import { FormEvent, useState } from "react";
import { AgentMessage } from "../lib/agent";

interface AgentChatProps {
  transcript: AgentMessage[];
  onSend: (message: string) => void;
  isProcessing?: boolean;
}

const quickPrompts = [
  "I need a virtual follow-up for my heart check this week.",
  "My child has a fever, who is available tomorrow morning?",
  "Find a dermatologist for a new rash, earliest possible slot."
];

export function AgentChat({ transcript, onSend, isProcessing }: AgentChatProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <section className="card chat-container" aria-label="AI agent conversation">
      <div className="chat-log">
        {transcript.length === 0 && (
          <div className="empty-state">
            <p>Conversation idle. Let the triage agent know what you need.</p>
          </div>
        )}
        {transcript.map((message) => (
          <article key={message.id} className={`message ${message.role === "user" ? "user" : "agent"}`}>
            <header className="message-header">
              <span>{message.role === "user" ? "You" : message.role}</span>
              <time>{new Date(message.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
            </header>
            <div className="message-body">
              {message.text.split("\n").map((line, index) => (
                <p key={index} style={{ margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <textarea
          className="input"
          placeholder="Describe the appointment you’d like the agents to orchestrate..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isProcessing}
        />
        <div className="inline-actions">
          <button className="btn" type="submit" disabled={!input.trim() || isProcessing}>
            {isProcessing ? "Processing..." : "Distribute to agents"}
          </button>
          <div className="chips" aria-hidden>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chip"
                onClick={() => onSend(prompt)}
                disabled={isProcessing}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}
