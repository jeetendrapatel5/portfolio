// app/api/contact/route.js
// POST /api/contact
// ─────────────────────────────────────────────────────────────────────────────
// Receives booking details from the contact page form.
// Sends two emails:
//   1. Notification to YOU with all client details
//   2. Confirmation to the CLIENT
//
// No database needed. When you confirm manually, you reply to the client
// with a calendar invite and meeting link.
//
// Required env vars (.env.local):
//   RESEND_API_KEY="re_..."
//   CONTACT_EMAIL="hello@jeetendra.dev"  ← your receiving address
//   NEXT_PUBLIC_URL="https://jeetendra.dev"
//
// Install: npm install resend
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

const YOUR_EMAIL = process.env.CONTACT_EMAIL || "hello@jeetendra.dev";
const FROM_NAME  = "Jeetendra Patel";
const SITE_URL   = process.env.NEXT_PUBLIC_URL || "https://jeetendra.dev";

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(body) {
  const errors = {};
  if (!body.name?.trim())                                       errors.name    = "Required";
  if (!body.email?.trim() || !/\S+@\S+\.\S+/.test(body.email)) errors.email   = "Valid email required";
  if (!body.project?.trim())                                    errors.project = "Required";
  if (!body.budget)                                             errors.budget  = "Required";
  if (!body.meetingType)                                        errors.type    = "Required";
  return errors;
}

// ─── Email HTML: notification to you ─────────────────────────────────────────

function notificationHTML(data) {
  const row = (label, value) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:110px;">
        <span style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:#555;">${label}</span>
      </td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid #1a1a1a;vertical-align:top;">
        <span style="color:#ccc;font-size:14px;line-height:1.6;">${value || "—"}</span>
      </td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>New booking request</title></head>
<body style="margin:0;padding:0;background:#080808;color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#444;margin:0 0 32px;">jeetendra.dev · new booking</p>
    <h1 style="font-size:24px;font-weight:600;letter-spacing:-0.03em;margin:0 0 6px;color:#f4f4f4;">New request: ${data.meetingTitle}</h1>
    <p style="color:#555;font-size:14px;margin:0 0 32px;">${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #1a1a1a;">
      ${row("Meeting",   `${data.meetingTitle} · ${data.meetingDuration}`)}
      ${row("Date",      data.preferredDate)}
      ${row("Time",      data.preferredTime)}
      ${row("Timezone",  data.timezone)}
      ${row("Name",      data.name)}
      ${row("Email",     `<a href="mailto:${data.email}" style="color:#777;">${data.email}</a>`)}
      ${row("Company",   data.company)}
      ${row("Budget",    data.budget)}
      ${row("Project",   data.project)}
    </table>
    <div style="margin-top:32px;">
      <a href="mailto:${data.email}?subject=Re: Your booking request - ${data.meetingTitle}&body=Hi ${data.name.split(" ")[0]},%0D%0A%0D%0AThank you for reaching out. Let's confirm your ${data.meetingTitle} for..." style="display:inline-block;padding:12px 20px;background:#f4f4f4;color:#080808;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;text-decoration:none;border-radius:6px;">
        Reply to ${data.name.split(" ")[0]} →
      </a>
    </div>
  </div>
</body>
</html>`;
}

// ─── Email HTML: confirmation to the client ───────────────────────────────────

function confirmationHTML(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Booking request received</title></head>
<body style="margin:0;padding:0;background:#080808;color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:540px;margin:0 auto;padding:48px 24px;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#444;margin:0 0 40px;">Jeetendra Patel</p>

    <h1 style="font-size:26px;font-weight:600;letter-spacing:-0.03em;margin:0 0 10px;color:#f4f4f4;">Request received.</h1>
    <p style="color:#777;font-size:15px;line-height:1.7;margin:0 0 36px;">
      Hi ${data.name.split(" ")[0]}, I've got your details and I'll be in touch within a few hours to confirm the time and share the meeting link.
    </p>

    <div style="background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:20px 24px;margin-bottom:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:90px;">
            <span style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#444;">Meeting</span>
          </td>
          <td style="padding:8px 0 8px 14px;border-bottom:1px solid #1a1a1a;">
            <span style="color:#ccc;font-size:13px;">${data.meetingTitle} · ${data.meetingDuration}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
            <span style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#444;">Preferred</span>
          </td>
          <td style="padding:8px 0 8px 14px;border-bottom:1px solid #1a1a1a;">
            <span style="color:#ccc;font-size:13px;">${data.preferredDate}, ${data.preferredTime}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;">
            <span style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#444;">Email</span>
          </td>
          <td style="padding:8px 0 8px 14px;">
            <span style="color:#ccc;font-size:13px;">${data.email}</span>
          </td>
        </tr>
      </table>
    </div>

    <p style="color:#555;font-size:13px;line-height:1.8;margin:0 0 8px;">
      In the meantime, feel free to browse my work at
      <a href="${SITE_URL}/projects" style="color:#777;">${SITE_URL}/projects</a>.
    </p>

    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #1a1a1a;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:#333;">
      © ${new Date().getFullYear()} Jeetendra Patel · Goa, India
    </div>
  </div>
</body>
</html>`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate
    const errors = validate(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Missing required fields", errors }, { status: 422 });
    }

    // Send emails via Resend
    if (!process.env.RESEND_API_KEY) {
      // Dev mode: just log and return success so you can test the UI
      console.log("[Contact] No RESEND_API_KEY — would have sent:", {
        to:      YOUR_EMAIL,
        from:    body.name,
        meeting: body.meetingTitle,
        date:    body.preferredDate,
      });
      return NextResponse.json({ success: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Fire both emails in parallel — if one fails, the other still goes
    const [notif, confirm] = await Promise.allSettled([
      // 1. Notification to you
      resend.emails.send({
        from:    `${FROM_NAME} Bookings <${YOUR_EMAIL}>`,
        to:      YOUR_EMAIL,
        replyTo: body.email,
        subject: `[New request] ${body.meetingTitle} from ${body.name}`,
        html:    notificationHTML(body),
      }),

      // 2. Confirmation to the client
      resend.emails.send({
        from:    `${FROM_NAME} <${YOUR_EMAIL}>`,
        to:      body.email,
        subject: `Your booking request: ${body.meetingTitle}`,
        html:    confirmationHTML(body),
      }),
    ]);

    // Log any failures (non-fatal — we still return success)
    if (notif.status   === "rejected") console.error("[Contact] Notification email failed:", notif.reason);
    if (confirm.status === "rejected") console.error("[Contact] Confirmation email failed:", confirm.reason);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { error: "Failed to send your request. Please try emailing directly." },
      { status: 500 }
    );
  }
}