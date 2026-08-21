import { SITE } from "./constants";

export function isEmailConfigured(): boolean {
  return Boolean(getResendApiKey() || getSmtpConfig());
}

export function emailStatus() {
  const smtp = getSmtpConfig();
  return {
    emailConfigured: isEmailConfigured(),
    emailProvider: getResendApiKey() ? "resend" : smtp ? "smtp" : "none",
    smtpHostSet: Boolean(process.env.SMTP_HOST?.trim()),
    smtpUserSet: Boolean(process.env.SMTP_USER?.trim()),
    smtpPassSet: Boolean(process.env.SMTP_PASS?.trim()),
  };
}

function getResendApiKey(): string | null {
  return process.env.RESEND_API_KEY?.trim() || null;
}

function getFromAddress(): string {
  const explicit = process.env.EMAIL_FROM?.trim();
  if (explicit) return explicit;
  const user = process.env.SMTP_USER?.trim();
  if (user) return `HarvestLinx Cooperative <${user}>`;
  return `HarvestLinx Cooperative <${SITE.contactEmail}>`;
}

function getSmtpConfig(): {
  host: string;
  port: number;
  user: string;
  pass: string;
} | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  // Gmail app passwords are often copied with spaces ("xxxx xxxx xxxx xxxx").
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "") ?? "";
  if (!host || !user || !pass) return null;
  const port = Number.parseInt(process.env.SMTP_PORT?.trim() || "587", 10);
  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    user,
    pass,
  };
}

export type EmailAttachment = {
  filename: string;
  contentBase64: string;
  contentId?: string;
  contentType?: string;
};

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
};

/**
 * Sends email via Resend (RESEND_API_KEY) or SMTP (SMTP_HOST/USER/PASS).
 * Returns false when email is not configured or the provider rejects the send.
 * Never throws — callers must not fail signups because mail failed.
 */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const resendKey = getResendApiKey();
  if (resendKey) {
    return sendWithResend(resendKey, input);
  }

  const smtp = getSmtpConfig();
  if (smtp) {
    return sendWithSmtp(smtp, input);
  }

  console.warn(
    "Email is not configured. Set RESEND_API_KEY (or SMTP_HOST, SMTP_USER, SMTP_PASS) to email certificates and ID cards."
  );
  return false;
}

async function sendWithResend(
  apiKey: string,
  input: SendEmailInput
): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        attachments: input.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.contentBase64,
          content_type: attachment.contentType,
          content_id: attachment.contentId,
        })),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Resend email failed:", response.status, body);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Resend email error:", error);
    return false;
  }
}

async function sendWithSmtp(
  smtp: { host: string; port: number; user: string; pass: string },
  input: SendEmailInput
): Promise<boolean> {
  try {
    const nodemailer = await import("nodemailer");
    const createTransport =
      nodemailer.createTransport ?? nodemailer.default.createTransport;
    const isGmail = /gmail\.com$/i.test(smtp.host);
    const transporter = createTransport(
      isGmail
        ? {
            service: "gmail",
            auth: { user: smtp.user, pass: smtp.pass },
          }
        : {
            host: smtp.host,
            port: smtp.port,
            secure: smtp.port === 465,
            requireTLS: smtp.port === 587,
            auth: { user: smtp.user, pass: smtp.pass },
          }
    );

    await transporter.sendMail({
      from: getFromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: input.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.contentBase64, "base64"),
        contentType: attachment.contentType,
        cid: attachment.contentId,
      })),
    });

    return true;
  } catch (error) {
    const err = error as { code?: string; response?: string; message?: string };
    console.error("SMTP email error:", err.code ?? "", err.response ?? err.message ?? error);
    return false;
  }
}
