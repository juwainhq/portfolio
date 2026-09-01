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
      className="py-28 md:py-40 lg:py-48 px-6 md:px-10 lg:px-16"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Label */}
        <span
          ref={labelRef}
          className="reveal block text-[10px] uppercase tracking-[0.3em] font-medium mb-14 md:mb-20 lg:mb-24"
        >
          Get in Touch
        </span>

        {/* Title - Dramatic oversized typography */}
        <div ref={titleRef} className="reveal mb-24 md:mb-32 lg:mb-40">
          <h2 className="text-[14vw] md:text-[11vw] lg:text-[9vw] xl:text-[7.5vw] font-display leading-[0.85] tracking-[-0.05em] uppercase font-medium">
            Let's Work
          </h2>
          <h2 className="text-[14vw] md:text-[11vw] lg:text-[9vw] xl:text-[7.5vw] font-display leading-[0.85] tracking-[-0.05em] uppercase font-medium ml-[15vw] md:ml-[20vw] lg:ml-[25vw]">
            Together.
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
              className="group inline-flex items-center gap-4 text-sm uppercase tracking-[0.2em] font-medium pt-6 hover:opacity-50 transition-opacity duration-300"
            >
              <span>Send Message</span>
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
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Email
              </p>
              <a
                href="mailto:hello@juwainhaque.com"
                className="text-base hover:opacity-50 transition-opacity duration-300"
              >
                hello@juwainhaque.com
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Instagram
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:opacity-50 transition-opacity duration-300"
              >
                @juwainhaque
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                LinkedIn
              </p>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:opacity-50 transition-opacity duration-300"
              >
                /in/juwainhaque
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Behance
              </p>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:opacity-50 transition-opacity duration-300"
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
