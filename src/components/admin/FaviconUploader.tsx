"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

interface FaviconUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

const BUCKET = "project-images";
const FOLDER = "site";
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB — favicons are tiny
const ALLOWED_EXTS = ["png", "jpg", "jpeg", "ico", "webp"];

export function FaviconUploader({ value, onChange }: FaviconUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Favicon too large (max 2 MB)");
      return;
    }

    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      toast.error(`Unsupported format. Allowed: ${ALLOWED_EXTS.join(", ")}`);
      return;
    }

    setUploading(true);
    try {
      const fileName = `${FOLDER}/favicon-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      const { data: pub } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      onChange(pub.publicUrl);
      toast.success("Favicon uploaded");
    } catch (err: any) {
      toast.error("Upload failed: " + (err?.message || "Unknown error"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        {/* Real-size favicon preview (32×32) */}
        <div className="flex-shrink-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
            Preview
          </p>
          <div className="w-16 h-16 rounded-md border border-border bg-muted/40 flex items-center justify-center overflow-hidden">
            {value ? (
              // Use plain <img> so ico / any format works without next/image optimization
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Favicon preview"
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span className="text-[9px] text-muted-foreground">No favicon</span>
            )}
          </div>
        </div>

        {/* Upload + URL */}
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.ico,.webp,image/png,image/jpeg,image/x-icon,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 mr-2" />
                  {value ? "Replace favicon" : "Upload favicon"}
                </>
              )}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
                aria-label="Remove favicon"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste favicon URL…"
            className="text-xs"
          />
          <p className="text-[10px] text-muted-foreground">
            PNG, JPG, ICO, or WebP. Leave empty to use the default favicon.
          </p>
        </div>
      </div>
    </div>
  );
}
