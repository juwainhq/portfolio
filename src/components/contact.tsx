"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";

type Status = { kind: "idle" | "sending" | "success" | "error"; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact form.
 *
 * Posts straight from the browser to a form-relay service — no backend, so it
 * keeps working on a static GitHub Pages deploy:
 *
 *   formspree → POST https://formspree.io/f/<FORM_ID>
 *   web3forms → POST https://api.web3forms.com/submit   (access_key in body)
 *
 * ⚠️ REPLACE THE FORM ID before going live: `contactFormId` in
 *    src/data/site-config.ts (default is the placeholder `YOUR_FORMSPREE_ID`).
 *    Until then the form refuses to pretend it sent anything and shows the
 *    email fallback instead.
 */
export function Contact() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const labelRef = useReveal();
  const titleRef = useReveal();
  const formRef = useReveal<HTMLFormElement>();
  const sideRef = useReveal();

  const provider = config.contactFormProvider ?? "formspree";
  const formId = (config.contactFormId ?? "").trim();
  const isConfigured =
    formId.length >= 6 && !/^(your|replace|placeholder)/i.test(formId);

  const endpoint =
    provider === "web3forms"
      ? "https://api.web3forms.com/submit"
      : `https://formspree.io/f/${formId}`;

  const mailto = config.contactFormRecipient
    ? `mailto:${config.contactFormRecipient}`
    : "#contact";

  const update = (key: keyof typeof formData, value: string) =>
    setFormData((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ kind: "error", message: "Please fill in every field." });
      return;
    }
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      setStatus({ kind: "error", message: "That email address looks incomplete." });
      return;
    }
    if (!isConfigured) {
      setStatus({
        kind: "error",
        message: `The form is not connected yet — add your ${provider} ID to continue, or email ${config.contactFormRecipient}.`,
      });
      return;
    }

    setStatus({ kind: "sending", message: "Sending…" });

    try {
      const payload =
        provider === "web3forms"
          ? {
              access_key: formId,
              subject: "New enquiry from the portfolio site",
              from_name: "Juwain Haque — portfolio",
              ...formData,
            }
          : {
              ...formData,
              _subject: "New enquiry from the portfolio site",
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; errors?: { message: string }[] }
        | null;

      const failed =
        !response.ok ||
        data?.success === false ||
        Boolean(data?.error) ||
        Boolean(data?.errors?.length);

      if (failed) {
        throw new Error(
          data?.error ?? data?.errors?.[0]?.message ?? "Request failed"
        );
      }

      setStatus({ kind: "success", message: config.contactSuccessMessage });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus({
        kind: "error",
        message: `Message could not be sent. Please try again, or email ${config.contactFormRecipient}.`,
      });
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative px-5 py-24 sm:px-6 md:px-10 md:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="rule mb-10 flex items-baseline justify-between gap-6 pt-5 md:mb-14">
          <span ref={labelRef} className="reveal eyebrow">
            {config.contactHeading}
          </span>
          <span className="eyebrow hidden text-muted-foreground sm:block">
            Dhaka · Worldwide
          </span>
        </div>

        <div ref={titleRef} className="reveal mb-16 md:mb-20">
          <h2
            id="contact-heading"
            className="display text-[clamp(2.6rem,13vw,8rem)]"
          >
            {config.contactTitleLine1}
          </h2>
          {/* Staggered second line — sized so it can never outgrow the
              viewport at any width (no horizontal scroll). */}
          <h2
            aria-hidden="true"
            className="display ml-[6vw] max-w-full text-[clamp(2.2rem,11.5vw,7.5rem)] text-ink-3 md:ml-[14vw]"
          >
            {config.contactTitleLine2}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            data-form-configured={isConfigured ? "true" : "false"}
            className="reveal flex flex-col gap-7 lg:col-span-7"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="eyebrow text-muted-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={(event) => update("name", event.target.value)}
                className="field"
                placeholder="Your name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="eyebrow text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(event) => update("email", event.target.value)}
                className="field"
                placeholder="you@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="eyebrow text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={(event) => update("message", event.target.value)}
                className="field resize-none"
                placeholder="Tell me about your project"
              />
            </div>

            {/* Honeypot: bots fill this, humans never see it. */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="submit"
                className="btn-stamp disabled:opacity-60"
                disabled={status.kind === "sending"}
              >
                {status.kind === "sending" ? (
                  <>
                    Sending
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    {config.contactSubmitText}
                    <ArrowRight size={14} aria-hidden="true" />
                  </>
                )}
              </button>

              <a
                href={mailto}
                className="link-underline inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                <Mail size={14} aria-hidden="true" />
                {config.contactFormRecipient}
              </a>
            </div>

            {/* Always-present live region so screen readers announce updates. */}
            <div aria-live="polite" className="min-h-[1.5rem]">
              {status.kind !== "idle" && status.kind !== "sending" ? (
                <p
                  className={`border-l-4 pl-4 text-sm ${
                    status.kind === "success"
                      ? "border-[hsl(var(--accent-1))] text-ink-1"
                      : "border-destructive text-destructive"
                  }`}
                  data-form-status={status.kind}
                >
                  {status.message}
                </p>
              ) : null}
            </div>

          </form>

          <aside
            ref={sideRef}
            className="reveal flex flex-col gap-8 lg:col-span-4 lg:col-start-9"
          >
            {config.socials.map((social) => (
              <div key={social.platform} className="flex flex-col gap-2">
                <p className="eyebrow text-muted-foreground">
                  {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                </p>
                <a
                  href={social.href}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel={social.platform === "email" ? undefined : "noopener noreferrer"}
                  className="link-underline self-start text-base md:text-lg"
                >
                  {social.label}
                </a>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
