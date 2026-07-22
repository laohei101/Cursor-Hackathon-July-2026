"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { DecodeHintType, BarcodeFormat } from "@zxing/library";

/**
 * Live barcode scanner. Uses the device camera via @zxing/browser and reports
 * the first decoded barcode. Degrades gracefully when no camera or permission
 * is available — the parent always offers manual entry as a fallback.
 */
export default function Scanner({
  active,
  onDetected,
  onError,
}: {
  active: boolean;
  onDetected: (barcode: string) => void;
  onError?: (message: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "scanning" | "error">(
    "idle"
  );

  useEffect(() => {
    if (!active) {
      controlsRef.current?.stop();
      controlsRef.current = null;
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("starting");

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
    ]);
    const reader = new BrowserMultiFormatReader(hints);

    (async () => {
      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result, err, ctrl) => {
            if (cancelled) return;
            if (result) {
              controlsRef.current = ctrl;
              ctrl.stop();
              onDetected(result.getText());
            }
          }
        );
        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
        setStatus("scanning");
      } catch (e: unknown) {
        if (cancelled) return;
        setStatus("error");
        const msg =
          e instanceof DOMException && e.name === "NotAllowedError"
            ? "Camera permission was denied. You can enter ingredients manually below."
            : "Couldn't start the camera. You can enter ingredients manually below.";
        onError?.(msg);
      }
    })();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [active, onDetected, onError]);

  if (!active) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-black shadow-sm">
      <video
        ref={videoRef}
        className="aspect-[4/3] w-full object-cover"
        muted
        playsInline
      />
      {/* Reticle */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-28 w-56 rounded-xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-center text-xs font-medium text-white">
        {status === "starting" && "Starting camera…"}
        {status === "scanning" && "Point at the barcode to scan"}
        {status === "error" && "Camera unavailable"}
      </div>
    </div>
  );
}
