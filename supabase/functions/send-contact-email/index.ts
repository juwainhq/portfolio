import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
  recipient?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateInput(data: ContactRequest): string | null {
  if (!data.name || !data.name.trim()) {
    return "Name is required.";
  }
  if (!data.email || !data.email.trim()) {
    return "Email is required.";
  }
  if (!validateEmail(data.email)) {
    return "Invalid email address.";
  }
  if (!data.message || !data.message.trim()) {
    return "Message is required.";
  }
  if (data.name.length > 200) {
    return "Name exceeds maximum length (200 characters).";
  }
  if (data.email.length > 200) {
    return "Email exceeds maximum length (200 characters).";
  }
  if (data.message.length > 5000) {
    return "Message exceeds maximum length (5000 characters).";
  }
  return null;
}

serve(async (req: Request) => {
  console.log("[send-contact-email] Received request", { method: req.method });

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactRequest = await req.json();
    console.log("[send-contact-email] Parsed request body");

    // Validate input
    const validationError = validateInput(body);
    if (validationError) {
      console.log("[send-contact-email] Validation failed:", validationError);
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, message, recipient } = body;
    const toEmail = recipient?.trim() || "hello@juwainhaque.com";

    console.log("[send-contact-email] Validated input, preparing email", {
      to: toEmail,
      from: email,
    });

    // Get Resend API key from secrets
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("[send-contact-email] RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured. Please try again later." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Contact Form <onboarding@resend.dev>",
        to: [toEmail],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
        reply_to: email,
      }),
    });

    console.log("[send-contact-email] Resend API response status:", resendResponse.status);

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error("[send-contact-email] Resend API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send email. Please try again later." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await resendResponse.json();
    console.log("[send-contact-email] Email sent successfully:", result.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully.",
        id: result.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[send-contact-email] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
