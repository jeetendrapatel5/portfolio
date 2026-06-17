"use client";

/**
 * app/contact/page.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * 4-step booking wizard that matches the portfolio's premium B&W design.
 *
 * STEPS:
 *   1  Meeting type  — Discovery Call / Deep Dive / Code Review
 *   2  Schedule      — preferred date (calendar) + time of day + timezone
 *   3  Details       — name, email, company, project description, budget
 *   4  Confirmation  — summary + "what happens next"
 *
 * DATA FLOW:
 *   User fills steps → POST /api/contact → Resend sends 2 emails
 *   (notification to you + confirmation to client) → step 4 renders
 *
 * SETUP:
 *   npm install resend
 *   Add to .env.local:
 *     RESEND_API_KEY="re_..."
 *     CONTACT_EMAIL="hello@jeetendra.dev"  ← where YOU receive notifications
 *     NEXT_PUBLIC_URL="https://jeetendra.dev"
 *
 *   Update portfolioData.js NAV_LINKS: { label: "Contact", href: "/contact" }
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import useGSAPMotion from "@/hooks/useGSAPMotion";
import useThemeMode from "@/hooks/useThemeMode";
import Cursor from "@/components/ui/Cursor";
import { NAV_LINKS } from "@/data/portfolioData";
import Navbar from "@/components/Navbar";
import {ArrowRight, ArrowLeft} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS  (edit this block to change meeting types, budget options, etc.)
// ─────────────────────────────────────────────────────────────────────────────

const MEETING_TYPES = [
  {
    id: "discovery",
    title: "Discovery Call",
    duration: "30 min",
    description:
      "For first conversations exploring fit, scoping your idea, and figuring out if we're the right match before committing to anything.",
    ideal: "New projects · First contact",
  },
  {
    id: "deep-dive",
    title: "Deep Dive",
    duration: "60 min",
    description:
      "For detailed technical discussions, architecture decisions, system design, or planning a complex product layer by layer.",
    ideal: "Architecture · System design",
  },
  {
    id: "code-review",
    title: "Code Review",
    duration: "45 min",
    description:
      "A focused review of your existing codebase with written findings, specific recommendations, and a clear path forward.",
    ideal: "Audits · Refactoring plans",
  },
];

const TIME_SLOTS = [
  { id: "morning",   label: "Morning",   sub: "9 AM – 12 PM IST"  },
  { id: "afternoon", label: "Afternoon", sub: "12 PM – 5 PM IST"  },
  { id: "evening",   label: "Evening",   sub: "5 PM – 8 PM IST"   },
];

const BUDGET_OPTIONS = [
  { value: "",             label: "Select budget range"  },
  { value: "under-500",    label: "Under $500"           },
  { value: "500-2000",     label: "$500 – $2,000"        },
  { value: "2000-5000",    label: "$2,000 – $5,000"      },
  { value: "5000-15000",   label: "$5,000 – $15,000"     },
  { value: "15000-plus",   label: "$15,000+"             },
  { value: "not-sure",     label: "Not sure yet"         },
];

const STEPS = [
  { num: "01", label: "Type"     },
  { num: "02", label: "Schedule" },
  { num: "03", label: "Details"  },
  { num: "04", label: "Done"     },
];

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/** Returns an array of Date|null for each cell in a month calendar grid. */
function getCalDays(month) {
  const y = month.getFullYear();
  const m = month.getMonth();
  const firstWeekday = new Date(y, m, 1).getDay(); // 0=Sun
  const daysInMonth  = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  return cells;
}

/** Returns true if the date cannot be booked. */
function isDisabled(date) {
  if (!date) return true;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const max   = new Date(today); max.setDate(max.getDate() + 56);
  const dow   = date.getDay();
  return date < today || date > max || dow === 0 || dow === 6;
}

function isToday(date) {
  if (!date) return false;
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return t.getTime() === d.getTime();
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

function formatDateLong(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  return (
    <div className="bk-steps" aria-label="Booking progress">
      {STEPS.map((s, i) => {
        const stepNum = i + 1;
        const active  = stepNum === currentStep;
        const done    = stepNum < currentStep;
        return (
          <div key={s.num} className="bk-step-group">
            <div
              className={[
                "bk-step",
                active ? "bk-step--active" : "",
                done   ? "bk-step--done"   : "",
              ].join(" ")}
              aria-current={active ? "step" : undefined}
            >
              <span className="bk-step__num">{s.num}</span>
              <span className="bk-step__label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="bk-step-sep" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}

// ── Meeting Type Cards ────────────────────────────────────────────────────────
function Step1({ value, onChange }) {
  return (
    <div>
      <p className="bk-sub">What kind of conversation are you looking for?</p>
      <div className="bk-type-grid">
        {MEETING_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t)}
            className={["bk-type-card", value?.id === t.id ? "bk-type-card--selected" : ""].join(" ")}
            aria-pressed={value?.id === t.id}
          >
            <span className="bk-type-duration">{t.duration}</span>
            <span className="bk-type-title">{t.title}</span>
            <span className="bk-type-desc">{t.description}</span>
            <span className="bk-type-ideal">{t.ideal}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Calendar + Time Preference ────────────────────────────────────────────────
function Step2({ date, onDate, timeSlot, onTime, timezone, onTimezone }) {
  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const days = getCalDays(calMonth);

  function prevMonth() {
    setCalMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCalMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const isPrevDisabled = calMonth <= new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div>
      <p className="bk-sub">Pick your preferred date and time. I'll confirm within a few hours.</p>

      <div className="bk-schedule-grid">
        {/* ── Calendar ── */}
        <div>
          <p className="bk-field-label" style={{ marginBottom: "1rem" }}>Preferred date</p>
          <div className="bk-cal">
            <div className="bk-cal-nav">
              <button
                type="button"
                className="bk-cal-arrow"
                onClick={prevMonth}
                disabled={isPrevDisabled}
                aria-label="Previous month"
              >←</button>
              <span className="bk-cal-title">
                {MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
              </span>
              <button
                type="button"
                className="bk-cal-arrow"
                onClick={nextMonth}
                aria-label="Next month"
              >→</button>
            </div>

            <div className="bk-cal-weekdays" aria-hidden="true">
              {WEEKDAYS.map((w) => (
                <span key={w} className="bk-cal-wd">{w}</span>
              ))}
            </div>

            <div className="bk-cal-days">
              {days.map((d, i) => {
                if (!d) return <span key={`e-${i}`} className="bk-cal-day bk-cal-day--empty" />;
                const disabled = isDisabled(d);
                const selected = isSameDay(d, date);
                const today_   = isToday(d);
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => !disabled && onDate(d)}
                    disabled={disabled}
                    aria-label={formatDateLong(d)}
                    aria-pressed={selected}
                    className={[
                      "bk-cal-day",
                      disabled ? "bk-cal-day--disabled" : "",
                      selected ? "bk-cal-day--selected" : "",
                      today_   ? "bk-cal-day--today"    : "",
                    ].join(" ")}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Time + Timezone ── */}
        <div style={{ display: "grid", gap: "2rem", alignContent: "start" }}>
          <div>
            <p className="bk-field-label" style={{ marginBottom: "0.75rem" }}>Preferred time of day</p>
            <div className="bk-time-pills">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTime(t)}
                  aria-pressed={timeSlot?.id === t.id}
                  className={["bk-pill", timeSlot?.id === t.id ? "bk-pill--selected" : ""].join(" ")}
                >
                  <span style={{ fontWeight: 500 }}>{t.label}</span>
                  <span style={{ color: "var(--quiet)", marginLeft: "0.5rem", fontSize: "0.65rem" }}>{t.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="bk-field-label" htmlFor="tz" style={{ display: "block", marginBottom: "0.45rem" }}>
              Your timezone
            </label>
            <input
              id="tz"
              className="bk-input"
              value={timezone}
              onChange={(e) => onTimezone(e.target.value)}
              placeholder="e.g. America/New_York"
            />
            <p style={{ marginTop: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--quiet)" }}>
              Auto-detected. Edit if wrong.
            </p>
          </div>

          {date && timeSlot && (
            <div className="bk-selected-summary">
              <span className="bk-selected-summary__label">Selected</span>
              <span className="bk-selected-summary__val">{formatDateLong(date)}</span>
              <span className="bk-selected-summary__val">{timeSlot.label} · {timeSlot.sub}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Details Form ──────────────────────────────────────────────────────────────
function Step3({ form, errors, onChange }) {
  function field(id, label, required, type = "text", placeholder = "") {
    return (
      <div className="bk-field">
        <label className="bk-field-label" htmlFor={id}>
          {label}{required && <span aria-hidden="true" style={{ color: "var(--quiet)", marginLeft: "0.2rem" }}>*</span>}
        </label>
        <input
          id={id}
          type={type}
          className={["bk-input", errors[id] ? "bk-input--err" : ""].join(" ")}
          value={form[id]}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          autoComplete={type === "email" ? "email" : "off"}
        />
        {errors[id] && <span className="bk-err-msg" role="alert">{errors[id]}</span>}
      </div>
    );
  }

  return (
    <div>
      <p className="bk-sub">Tell me about yourself and what you're building.</p>

      <div className="bk-form">
        <div className="bk-form-row bk-form-row--2">
          {field("name",    "Full name",         true,  "text",  "Jeetu Patel")}
          {field("email",   "Email address",     true,  "email", "you@company.com")}
        </div>
        {field("company",   "Company / Organisation", false, "text", "Optional")}
        <div className="bk-field">
          <label className="bk-field-label" htmlFor="project">
            What are you building?<span aria-hidden="true" style={{ color: "var(--quiet)", marginLeft: "0.2rem" }}>*</span>
          </label>
          <textarea
            id="project"
            className={["bk-input bk-textarea", errors.project ? "bk-input--err" : ""].join(" ")}
            value={form.project}
            onChange={(e) => onChange("project", e.target.value)}
            placeholder="Describe the product, the problem it solves, and where you are in the process."
            rows={4}
          />
          {errors.project && <span className="bk-err-msg" role="alert">{errors.project}</span>}
        </div>
        <div className="bk-field">
          <label className="bk-field-label" htmlFor="budget">
            Budget range<span aria-hidden="true" style={{ color: "var(--quiet)", marginLeft: "0.2rem" }}>*</span>
          </label>
          <select
            id="budget"
            className={["bk-input bk-select", errors.budget ? "bk-input--err" : ""].join(" ")}
            value={form.budget}
            onChange={(e) => onChange("budget", e.target.value)}
          >
            {BUDGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={o.value === ""}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.budget && <span className="bk-err-msg" role="alert">{errors.budget}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Confirmation ──────────────────────────────────────────────────────────────
function Step4({ meetingType, date, timeSlot, form }) {
  const typeLabel = MEETING_TYPES.find((t) => t.id === meetingType?.id);

  return (
    <div style={{ maxWidth: "38rem" }}>
      {/* Icon */}
      <div className="bk-confirm-icon" aria-hidden="true">✓</div>

      <h2 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
        fontWeight: 600,
        letterSpacing: "-0.04em",
        color: "var(--white)",
        margin: "0 0 0.5rem",
      }}>
        Request received.
      </h2>

      <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: 0, fontSize: "0.95rem" }}>
        I'll review your details and reply to <strong style={{ color: "var(--white)" }}>{form.email}</strong> within a few hours to confirm the time and share the meeting link.
      </p>

      {/* Summary card */}
      <div className="bk-summary">
        {[
          { k: "Meeting",  v: `${typeLabel?.title} · ${typeLabel?.duration}` },
          { k: "Date",     v: date ? formatDateLong(date) : "—" },
          { k: "Time",     v: timeSlot ? `${timeSlot.label} (${timeSlot.sub})` : "—" },
          { k: "Name",     v: form.name },
          { k: "Email",    v: form.email },
          form.company && { k: "Company", v: form.company },
          { k: "Budget",   v: BUDGET_OPTIONS.find((o) => o.value === form.budget)?.label || "—" },
        ].filter(Boolean).map(({ k, v }) => (
          <div key={k} className="bk-summary-row">
            <span className="bk-summary-key">{k}</span>
            <span className="bk-summary-val">{v}</span>
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div className="bk-next-steps">
        {[
          { n: "01", text: "I'll review your project details before we speak." },
          { n: "02", text: "Expect a reply within a few hours confirming the exact time." },
          { n: "03", text: "You'll receive a calendar invite with the meeting link." },
        ].map(({ n, text }) => (
          <div key={n} className="bk-next-step">
            <span className="bk-next-num">{n}</span>
            <span style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}>
        <Link href="/projects" className="button button--ghost">
          View projects →
        </Link>
        <Link href="/" className="button button--ghost">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  useGSAPMotion();

  // ── Wizard state ────────────────────────────────────────────────────────────
  const [step,        setStep]        = useState(1);
  const [meetingType, setMeetingType] = useState(null);
  const [date,        setDate]        = useState(null);
  const [timeSlot,    setTimeSlot]    = useState(null);
  const [timezone,    setTimezone]    = useState("");
  const [form,        setForm]        = useState({ name: "", email: "", company: "", project: "", budget: "" });
  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [submitErr,   setSubmitErr]   = useState("");
  const { isThemeAnimating, theme, toggleTheme } = useThemeMode();

  // ── Auto-detect timezone ────────────────────────────────────────────────────
  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setTimezone("UTC");
    }
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────────
  function canAdvance() {
    if (step === 1) return !!meetingType;
    if (step === 2) return !!date && !!timeSlot;
    if (step === 3) return true; // validated on submit attempt
    return false;
  }

  function next() {
    if (step === 3) { handleSubmit(); return; }
    if (canAdvance()) setStep((s) => s + 1);
  }

  function back() { setStep((s) => Math.max(1, s - 1)); }

  // ── Form field update ───────────────────────────────────────────────────────
  function updateForm(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" })); // clear field error on change
  }

  // ── Submission ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    // Validate
    const errs = {};
    if (!form.name.trim())                                    errs.name    = "Your name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "A valid email is required";
    if (!form.project.trim())                                 errs.project = "Please describe what you're building";
    if (!form.budget)                                         errs.budget  = "Please select a budget range";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitErr("");

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingType: meetingType.id,
          meetingTitle: meetingType.title,
          meetingDuration: meetingType.duration,
          preferredDate: date ? formatDateLong(date) : "Not specified",
          preferredTime: timeSlot ? `${timeSlot.label} (${timeSlot.sub})` : "Not specified",
          timezone,
          ...form,
        }),
      });

      if (res.ok) {
        setStep(4);
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitErr(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitErr("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── CTA labels per step ─────────────────────────────────────────────────────
  const ctaLabel = {
    1: "Continue",
    2: "Continue",
    3: submitting ? "Sending…" : "Send Request",
  }[step];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Scoped styles ─────────────────────────────────────────────────── */}
      <style>{`
        /* Step indicator */
        .bk-steps {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
          margin-bottom: 2.75rem;
        }
        .bk-step-group { display: flex; align-items: center; }
        .bk-step {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--faint);
          transition: color 0.3s;
          white-space: nowrap;
        }
        .bk-step--active { color: var(--white); }
        .bk-step--done   { color: var(--quiet); }
        .bk-step__num    { font-weight: 500; }
        .bk-step-sep {
          width: clamp(1.5rem, 4vw, 3rem);
          height: 1px;
          background: var(--line);
          margin: 0 0.6rem;
          flex-shrink: 0;
        }

        /* Page sub-copy */
        .bk-sub {
          color: var(--muted);
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0 0 2rem;
          max-width: 44rem;
        }

        /* Meeting type cards */
        .bk-type-grid {
          display: grid;
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          border-radius: 10px;
          overflow: hidden;
        }
        @media (min-width: 44rem) {
          .bk-type-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .bk-type-card {
          text-align: left;
          background: var(--black);
          padding: 1.75rem 1.5rem;
          cursor: pointer;
          display: grid;
          gap: 0.55rem;
          align-content: start;
          border: none;
          outline: none;
          transition: background 0.2s;
        }
        .bk-type-card:hover { background: var(--surface-soft); }
        .bk-type-card:focus-visible { outline: 1px solid var(--line-strong); outline-offset: -1px; }
        .bk-type-card--selected { background: var(--surface-strong); }
        .bk-type-duration {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--quiet);
        }
        .bk-type-card--selected .bk-type-duration { color: var(--muted); }
        .bk-type-title {
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          color: var(--white);
          line-height: 1.2;
        }
        .bk-type-desc {
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.65;
        }
        .bk-type-ideal {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--quiet);
          margin-top: 0.25rem;
        }

        /* Schedule grid */
        .bk-schedule-grid {
          display: grid;
          gap: 2.5rem;
        }
        @media (min-width: 52rem) {
          .bk-schedule-grid { grid-template-columns: auto 1fr; }
        }

        /* Calendar */
        .bk-cal { max-width: 20rem; }
        .bk-cal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.1rem;
        }
        .bk-cal-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--white);
        }
        .bk-cal-arrow {
          background: none;
          border: 1px solid var(--line);
          color: var(--muted);
          width: 2rem;
          height: 2rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.78rem;
          display: grid;
          place-items: center;
          transition: border-color 0.18s, color 0.18s;
        }
        .bk-cal-arrow:hover:not(:disabled) { border-color: var(--muted); color: var(--white); }
        .bk-cal-arrow:disabled { opacity: 0.22; cursor: not-allowed; }
        .bk-cal-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 0.3rem;
        }
        .bk-cal-wd {
          text-align: center;
          font-family: var(--font-mono);
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--quiet);
          padding: 0.3rem 0;
        }
        .bk-cal-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .bk-cal-day {
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          font-size: 0.8rem;
          border-radius: 5px;
          cursor: pointer;
          color: var(--muted);
          background: none;
          border: 1px solid transparent;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          font-family: inherit;
        }
        .bk-cal-day:hover:not(:disabled):not(.bk-cal-day--selected) {
          background: var(--surface-soft);
          color: var(--white);
        }
        .bk-cal-day:focus-visible { outline: 1px solid var(--line-strong); }
        .bk-cal-day--today { border-color: var(--line); color: var(--white); }
        .bk-cal-day--selected { background: var(--white); color: var(--black); font-weight: 600; border-color: transparent; }
        .bk-cal-day--disabled { opacity: 0.2; cursor: not-allowed; pointer-events: none; }
        .bk-cal-day--empty { pointer-events: none; visibility: hidden; }

        /* Time preference pills */
        .bk-time-pills { display: flex; flex-direction: column; gap: 0.45rem; }
        .bk-pill {
          text-align: left;
          padding: 0.7rem 1rem;
          border: 1px solid var(--line);
          border-radius: 7px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--muted);
          cursor: pointer;
          background: transparent;
          transition: all 0.18s;
          display: flex;
          align-items: center;
        }
        .bk-pill:hover { border-color: var(--line-strong); color: var(--white); }
        .bk-pill--selected {
          background: var(--white);
          border-color: var(--white);
          color: var(--black);
        }
        .bk-pill--selected span { color: var(--black) !important; }

        /* Selected date+time summary */
        .bk-selected-summary {
          padding: 1rem 1.1rem;
          border: 1px solid var(--line);
          border-radius: 7px;
          display: grid;
          gap: 0.3rem;
        }
        .bk-selected-summary__label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--quiet);
          margin-bottom: 0.1rem;
        }
        .bk-selected-summary__val {
          color: var(--muted-strong);
          font-size: 0.85rem;
          line-height: 1.5;
        }

        /* Form */
        .bk-form { display: grid; gap: 1.25rem; }
        .bk-form-row { display: grid; gap: 1.25rem; }
        @media (min-width: 44rem) { .bk-form-row--2 { grid-template-columns: 1fr 1fr; } }
        .bk-field { display: grid; gap: 0.42rem; }
        .bk-field-label {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--quiet);
        }
        .bk-input {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--white);
          padding: 0.7rem 0.9rem;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          border-radius: 7px;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.18s;
          -webkit-appearance: none;
        }
        .bk-input::placeholder { color: var(--quiet); }
        .bk-input:focus { border-color: var(--line-strong); }
        .bk-input--err { border-color: #b94040 !important; }
        .bk-textarea { resize: vertical; min-height: 7rem; line-height: 1.65; }
        .bk-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.9rem center;
          padding-right: 2.5rem;
        }
        /* Fix option text color in light mode */
        .bk-select option { background: var(--black-soft); color: var(--white); }
        .bk-err-msg {
          font-family: var(--font-mono);
          font-size: 0.63rem;
          color: #b94040;
          margin-top: 0.1rem;
        }

        /* Confirmation */
        .bk-confirm-icon {
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 50%;
          border: 1px solid var(--line);
          display: grid;
          place-items: center;
          margin-bottom: 1.5rem;
          color: var(--white);
          font-size: 1.15rem;
          font-family: var(--font-mono);
        }
        .bk-summary {
          border: 1px solid var(--line);
          border-radius: 9px;
          overflow: hidden;
          margin: 1.75rem 0;
        }
        .bk-summary-row {
          display: grid;
          grid-template-columns: 5.5rem 1fr;
          gap: 1rem;
          padding: 0.8rem 1.1rem;
          border-bottom: 1px solid var(--line);
          font-size: 0.86rem;
        }
        .bk-summary-row:last-child { border-bottom: none; }
        .bk-summary-key {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--quiet);
          padding-top: 0.1rem;
        }
        .bk-summary-val { color: var(--muted); line-height: 1.55; }
        .bk-next-steps { display: grid; gap: 0.75rem; margin-top: 1.5rem; }
        .bk-next-step {
          display: flex;
          gap: 0.9rem;
          align-items: start;
        }
        .bk-next-num {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          text-transform: uppercase;
          color: var(--quiet);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        /* Step navigation footer */
        .bk-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2.5rem;
          padding-top: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .bk-back {
          background: none;
          border: none;
          color: var(--quiet);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          padding: 0;
          transition: color 0.18s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .bk-back:hover { color: var(--muted); }

        /* Submit error */
        .bk-submit-err {
          padding: 0.8rem 1rem;
          border: 1px solid #b94040;
          border-radius: 7px;
          color: #b94040;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          margin-top: 1rem;
          line-height: 1.6;
        }
      `}</style>

      {/* ── Entrance overlay ────────────────────────────────────────────────── */}
      <div className="intro-wipe"><span>Contact</span></div>
      <Cursor />
      <Navbar links={NAV_LINKS} onThemeToggle={toggleTheme} theme={theme} />

      {/* ── Scroll progress ─────────────────────────────────────────────────── */}
      <div className="scroll-progress"><div className="scroll-progress__bar" /></div>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <header
        className="section section--no-border"
        style={{ paddingTop: "calc(var(--section-pad))" }}
      >
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "2rem",
        }}>
          <div className="section-header">
            <p className="section-kicker" data-index="04">Get in touch</p>
            <h1 className="section-title">Book a call.</h1>
            <p className="section-copy">
              Fill in the details below and I'll get back to you within a few hours to confirm the time and send a meeting link. No automated scheduling just a direct conversation.
            </p>
          </div>

          {/* Availability badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            <span style={{
              width: "0.42rem",
              height: "0.42rem",
              borderRadius: "50%",
              background: "var(--white)",
              flexShrink: 0,
              animation: "status-pulse 2.4s ease-out infinite",
            }} aria-hidden="true" />
            Open for projects
          </div>
        </div>
      </header>

      {/* ── Booking wizard ───────────────────────────────────────────────────── */}
      <section className="section section--no-border" style={{ paddingTop: "2rem" }}>

        {step < 4 && <StepIndicator currentStep={step} />}

        {/* Step content */}
        {step === 1 && (
          <Step1 value={meetingType} onChange={setMeetingType} />
        )}
        {step === 2 && (
          <Step2
            date={date}            onDate={setDate}
            timeSlot={timeSlot}    onTime={setTimeSlot}
            timezone={timezone}    onTimezone={setTimezone}
          />
        )}
        {step === 3 && (
          <Step3 form={form} errors={errors} onChange={updateForm} />
        )}
        {step === 4 && (
          <Step4
            meetingType={meetingType}
            date={date}
            timeSlot={timeSlot}
            form={form}
          />
        )}

        {/* Submit error */}
        {submitErr && (
          <div className="bk-submit-err" role="alert">{submitErr}</div>
        )}

        {/* Step navigation */}
        {step < 4 && (
          <div className="bk-nav">
            {step > 1 ? (
              <button type="button" className="bk-back" onClick={back}>
                <ArrowLeft height={15} width={15} /> Back
              </button>
            ) : (
              <div /> /* spacer so CTA stays right-aligned on step 1 */
            )}

            <button
              type="button"
              className="button"
              onClick={next}
              disabled={!canAdvance() || submitting}
              style={{ opacity: (!canAdvance() || submitting) ? 0.45 : 1 }}
              data-reveal
            >
              {ctaLabel}
              {!submitting && <span className="button__arrow"><ArrowRight height={15} width={15} /></span>}
            </button>
          </div>
        )}
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="footer">
        <span>© {new Date().getFullYear()} Jeetendra Patel</span>
        <span>Full-stack developer · Goa, India</span>
        <Link href="/" style={{ color: "inherit" }}>jeetendra.dev</Link>
      </footer>
    </>
  );
}