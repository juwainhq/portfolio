"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useReveal } from "@/hooks/use-reveal";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const labelRef = useReveal();
  const titleRef = useReveal();
  const formRef = useReveal();
  const socialsRef = useReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Message sent. I'll be in touch soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 lg:py-40 px-6 md:px-10 lg:px-16 border-t border-border/30"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Label */}
        <h2
          ref={labelRef}
          className="reveal text-xs uppercase tracking-ultra-wide font-medium mb-12 md:mb-16"
        >
          Contact
        </h2>

        {/* Title - Oversized */}
        <div
          ref={titleRef}
          className="reveal mb-16 md:mb-20"
        >
          <h2 className="text-[15vw] md:text-[12vw] lg:text-[10vw] xl:text-[8.5vw] font-display leading-[0.85] tracking-tightest uppercase font-medium">
            Let's Work
          </h2>
          <h2 className="text-[15vw] md:text-[12vw] lg:text-[10vw] xl:text-[8.5vw] font-display leading-[0.85] tracking-tightest uppercase font-medium ml-[10vw] md:ml-[15vw] lg:ml-[20vw]">
            Together.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form */}
          <form
            ref={formRef}
            className="reveal lg:col-span-7 space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2"
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
                className="w-full bg-transparent border-b border-border py-3 text-base focus:outline-none focus:border-foreground transition-colors duration-300"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2"
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
                className="w-full bg-transparent border-b border-border py-3 text-base focus:outline-none focus:border-foreground transition-colors duration-300"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="w-full bg-transparent border-b border-border py-3 text-base focus:outline-none focus:border-foreground transition-colors duration-300 resize-none"
                placeholder="Tell me about your project"
              />
            </div>

            <button
              type="submit"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-ultra-wide font-medium pt-6 hover:opacity-50 transition-opacity duration-300"
            >
              <span>Send</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </form>

          {/* Socials */}
          <div
            ref={socialsRef}
            className="reveal lg:col-span-4 lg:col-start-9 space-y-6"
          >
            <div>
              <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-2">
                Email
              </p>
              <a
                href="mailto:hello@juwainhaque.com"
                className="text-sm hover:opacity-50 transition-opacity duration-300"
              >
                hello@juwainhaque.com
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-2">
                Instagram
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:opacity-50 transition-opacity duration-300"
              >
                @juwainhaque
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-2">
                LinkedIn
              </p>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:opacity-50 transition-opacity duration-300"
              >
                /in/juwainhaque
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-2">
                Behance
              </p>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:opacity-50 transition-opacity duration-300"
              >
                /juwainhaque
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
