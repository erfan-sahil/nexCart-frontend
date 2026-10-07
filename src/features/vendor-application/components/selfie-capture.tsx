"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

import { uploadSelfie } from "../api";
import { Field } from "./fields";

type SelfieCaptureProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

async function snapshot(video: HTMLVideoElement) {
  if (video.videoWidth < 1 || video.videoHeight < 1) return null;

  const maxEdge = 960;
  const scale = Math.min(
    1,
    maxEdge / Math.max(video.videoWidth, video.videoHeight),
  );
  const width = Math.max(1, Math.round(video.videoWidth * scale));
  const height = Math.max(1, Math.round(video.videoHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) return null;

  context.translate(width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, width, height);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.85);
  });
}

export function SelfieCapture({ value, onChange, error }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const shown = previewUrl || value;

  useEffect(() => {
    return () => {
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!live || !video || !stream) return;

    video.srcObject = stream;
    void video.play().catch(() => undefined);
  }, [live]);

  function closeCamera() {
    stopStream(streamRef.current);
    streamRef.current = null;
    setLive(false);
  }

  async function openCamera() {
    if (uploading) return;

    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 960 },
          height: { ideal: 960 },
        },
      });

      stopStream(streamRef.current);
      streamRef.current = stream;
      setLive(true);
    } catch {
      closeCamera();
      setCameraError("Allow camera access to take a selfie.");
    }
  }

  async function takePhoto() {
    const video = videoRef.current;

    if (!video || uploading) return;

    const blob = await snapshot(video);

    if (!blob) {
      setCameraError("Could not capture that photo. Try again.");
      return;
    }

    const nextPreview = URL.createObjectURL(blob);
    setPreviewUrl(nextPreview);
    closeCamera();
    setUploading(true);
    setCameraError(null);

    try {
      const url = await uploadSelfie(blob);
      onChange(url);
    } catch (uploadError) {
      setCameraError(
        uploadError instanceof ApiError
          ? uploadError.message
          : "Could not save the selfie. Try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  const message = cameraError || error;

  return (
    <Field
      label="Selfie"
      hint={
        message || shown
          ? undefined
          : "Optional. Click to open the front camera."
      }
      error={message}
    >
      {live ? (
        <button
          type="button"
          onClick={() => void takePhoto()}
          className="relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-black"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="aspect-[4/3] w-full -scale-x-100 object-cover"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm font-medium text-white">
            Click to take the photo
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void openCamera()}
          disabled={uploading}
          className={cn(
            "flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground transition-colors hover:border-primary/50 disabled:cursor-wait",
            shown && "border-solid p-0",
          )}
        >
          {shown ? (
            // User-captured and uploaded photos are arbitrary remote URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shown}
              alt="Your selfie"
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <>
              <Camera className="size-6" />
              Take a selfie
            </>
          )}
        </button>
      )}
      {uploading ? (
        <p className="text-sm text-muted-foreground">Saving photo...</p>
      ) : shown && !live ? (
        <p className="text-sm text-muted-foreground">
          Click the photo to take another one.
        </p>
      ) : null}
    </Field>
  );
}
