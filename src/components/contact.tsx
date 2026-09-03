"use client";

import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useReveal } from "@/hooks/use-reveal";
import { useSiteConfig } from "@/context/site-config";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Use text/plain so the request is a CORS "simple request" — no preflight.
      // Google Apps Script Web Apps do not handle OPTIONS preflight, and they
      // do not return CORS headers for application/json POSTs, which causes
      // the browser to block the request. Sending a JSON string as text/plain
      // avoids that, and the Apps Script's doPost parses e.postData.contents.
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbyX7oSqfciSJCaJWqLxLi5f86x2pO3OaKL4dvZvMTwGV6K-F2-yGVaZ1Lgb8tNDTPj1bw/exec",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            recipient: config.contactFormRecipient,
          }),
        }
      );

      // Read as text first — Apps Script responses may not always be
      // parseable JSON from the browser's perspective (opaque/cors-restricted).
      const text = await res.text();
      let data: { ok?: boolean; error?: string } | null = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (res.ok && (!data || data.ok !== false)) {
        toast.success(config.contactSuccessMessage);
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data?.error || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
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
          {/* Form */}
          <form
            ref={formRef}
            className="reveal lg:col-span-7 space-y-8"
            onSubmit={handleSubmit}
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
