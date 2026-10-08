"use client";

import { FileText, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

import { uploadApplicationFile } from "../api";
import { Field } from "./fields";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const FILE_TYPES = [...IMAGE_TYPES, "application/pdf"];

function isImageUrl(value: string) {
  return /\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(value);
}

function fileName(value: string) {
  try {
    const url = new URL(value);
    const name = url.pathname.split("/").pop();
    return name || "Uploaded file";
  } catch {
    return "Uploaded file";
  }
}

function uploadErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return "Could not upload that file. Try again.";
}

type DocumentImagesUploadProps = {
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
};

export function DocumentImagesUpload({
  values,
  onChange,
  error,
}: DocumentImagesUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const images = values.filter(Boolean);
  const message = localError || error;

  async function onFiles(list: FileList | null) {
    const files = [...(list ?? [])].slice(0, 4 - images.length);
    if (inputRef.current) inputRef.current.value = "";
    if (files.length === 0 || uploading) return;

    const invalid = files.find((file) => !IMAGE_TYPES.includes(file.type));
    if (invalid) {
      setLocalError("Upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    setUploading(true);
    setLocalError(null);

    try {
      let next = images;

      for (const file of files) {
        const url = await uploadApplicationFile(file);
        next = [...next, url].slice(0, 4);
        onChange(next);
      }
    } catch (uploadError) {
      setLocalError(uploadErrorMessage(uploadError));
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field
      label="Document images"
      hint={message ? undefined : "Upload up to 4 photos of the document."}
      error={message}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((src) => (
          <div
            key={src}
            className="relative overflow-hidden rounded-2xl border border-border bg-background"
          >
            {/* Uploaded document photos are served from the API origin. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Identity document"
              className="aspect-[4/3] w-full object-cover"
            />
            <button
              type="button"
              aria-label="Remove image"
              className="absolute top-2 right-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
              onClick={() => onChange(images.filter((image) => image !== src))}
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {images.length < 4 ? (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground transition-colors hover:border-primary/50 disabled:cursor-wait"
          >
            <ImagePlus className="size-5" />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        multiple
        className="sr-only"
        onChange={(event) => void onFiles(event.target.files)}
      />
    </Field>
  );
}

type ApplicationFileUploadProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function ApplicationFileUpload({
  label,
  hint = "Optional. PDF or image.",
  value,
  onChange,
  error,
}: ApplicationFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const message = localError || error;

  async function onFile(list: FileList | null) {
    const file = list?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file || uploading) return;

    if (!FILE_TYPES.includes(file.type)) {
      setLocalError("Upload a PDF, JPEG, PNG, WebP, or GIF file.");
      return;
    }

    setUploading(true);
    setLocalError(null);

    try {
      onChange(await uploadApplicationFile(file));
    } catch (uploadError) {
      setLocalError(uploadErrorMessage(uploadError));
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field
      label={label}
      hint={message || value ? undefined : hint}
      error={message}
    >
      <input
        ref={inputRef}
        type="file"
        accept={FILE_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => void onFile(event.target.files)}
      />
      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
          {isImageUrl(value) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="size-14 rounded-xl object-cover"
            />
          ) : (
            <span className="inline-flex size-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <FileText className="size-5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{fileName(value)}</p>
            <button
              type="button"
              className="mt-1 cursor-pointer text-sm font-medium text-primary hover:underline"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Replace"}
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 cursor-pointer rounded-full px-3"
            onClick={() => onChange("")}
          >
            Remove
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground transition-colors hover:border-primary/50 disabled:cursor-wait",
          )}
        >
          <FileText className="size-5" />
          {uploading ? "Uploading..." : "Upload file"}
        </button>
      )}
    </Field>
  );
}
