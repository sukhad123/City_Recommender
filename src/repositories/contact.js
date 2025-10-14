"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail({ name, email, message }) {
  if (!name || !email || !message) {
    throw new Error("Missing required fields");
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `New message from ${name}`,
    text: `From: ${name} (${email})\n\n${message}`,
    html: `<p><b>From:</b> ${name} (${email})</p><p>${message}</p>`
  });

  return { success: true };
}
