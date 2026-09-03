"use client";

import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useReveal } from "@/hooks/use-reveal";
import { useSiteConfig } from "@/context/site-config";

// Google Apps Script Web App /exec endpoint. Posting via a native HTML form
// (targeted at a hidden iframe) avoids CORS entirely — the browser performs
// a real navigation submit, so the response is loaded into the iframe and
// the main page is never navigated away or blocked by the browser.
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyX7oSqfciSJCaJWqLxLi5f86x2pO3OaKL4dvZvMTwGV6K-F2-yGVaZ1Lgb8tNDTPj1bw/exec";

export function Contact() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const labelRef = useReveal();
  const titleRef = useReveal();
  const formRef = useRef<HTMLFormElement | null>(null);
  const socialsRef = useReveal();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formEl = formRef.current;
    if (!formEl) {
      toast.error("Failed to send message. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      // form.submit() bypasses React's onSubmit and performs a real native
      // browser navigation submit. With target="contact_iframe", the response
      // is loaded into the hidden iframe — the main page never navigates,
      // and CORS is never triggered. Apps Script's doPost(e) executes
      // server-side, reading fields from e.parameter.*.
      formEl.submit();
      // We can't reliably read the cross-origin iframe response, so we
      // assume the native submit succeeded and reset state after a short
      // delay so the UI feels responsive.
      window.setTimeout(() => {
        toast.success(config.contactSuccessMessage);
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
      }, 1500);
    } catch {
      toast.error("Failed to send message. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-28 md:py-40 lg:py-48 px-6 md:px-10 lg:px-16"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Label */}
        <span
          ref={labelRef}
          className="reveal block text-[10px] uppercase tracking-[0.3em] font-medium mb-14 md:mb-20 lg:mb-24"
        >
          {config.contactHeading}
        </span>

        {/* Title - Dramatic oversized typography */}
        <div ref={titleRef} className="reveal mb-24 md:mb-32 lg:mb-40">
          <h2 className="text-[14vw] md:text-[11vw] lg:text-[9vw] xl:text-[7.5vw] font-display leading-[0.85] tracking-[-0.05em] uppercase font-medium">
            {config.contactTitleLine1}
          </h2>
          <h2 className="text-[14vw] md:text-[11vw] lg:text-[9vw] xl:text-[7.5vw] font-display leading-[0.85] tracking-[-0.05em] uppercase font-medium ml-[15vw] md:ml-[20vw] lg:ml-[25vw]">
            {config.contactTitleLine2}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          {/* Hidden iframe — target of the form POST. Display:none keeps
              the page from showing any response UI. */}
          <iframe
            ref={iframeRef}
            name="contact_iframe"
            title="contact submission target"
            style={{ display: "none" }}
          />

          {/* Form */}
          <form
            ref={formRef}
            className="reveal lg:col-span-7 space-y-8"
            onSubmit={handleSubmit}
            action={APPS_SCRIPT_URL}
            method="POST"
            target="contact_iframe"
          >
            <div>
              <label
                htmlFor="name"
                className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-3"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-transparent border-b border-foreground/20 py-3 text-base focus:outline-none focus:border-foreground transition-colors duration-300 placeholder:text-white/50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-3"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-transparent border-b border-foreground/20 py-3 text-base focus:outline-none focus:border-foreground transition-colors duration-300 placeholder:text-white/50"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-3"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                className="w-full bg-transparent border-b border-foreground/20 py-3 text-base focus:outline-none focus:border-foreground transition-colors duration-300 resize-none placeholder:text-white/50"
                placeholder="Tell me about your project"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center gap-4 text-sm uppercase tracking-[0.2em] font-medium pt-6 hover:opacity-50 transition-opacity duration-300 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Sending..." : config.contactSubmitText}</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </form>

          {/* Social Links */}
          <div
            ref={socialsRef}
            className="reveal lg:col-span-4 lg:col-start-9 space-y-10 pt-2"
          >
            {config.socials.map((social) => (
              <div key={social.platform}>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                </p>
                <a
                  href={social.href}
                  target={social.platform === "email" ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  className="text-base hover:opacity-50 transition-opacity duration-300"
                >
                  {social.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
