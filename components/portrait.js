"use client";

import { useState } from "react";
import TiltCard from "@/components/tilt-card";
import { profile } from "@/data/profile";

// Portrait card for the About section. Uses /portrait.jpg from /public;
// the page checks for the file server-side and passes `available`, so the
// monogram placeholder renders without ever requesting a missing image.
export default function Portrait({ available = true }) {
  const [failed, setFailed] = useState(false);
  const showImage = available && !failed;

  return (
    <TiltCard max={2} className="panel group relative overflow-hidden rounded-3xl">
      <div className="relative aspect-[4/5]">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/portrait.jpg"
            alt={`Portrait of ${profile.name}`}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bg-2">
            <span className="display flex h-24 w-24 items-center justify-center rounded-3xl bg-fg text-3xl text-bg">
              {profile.initials}
            </span>
            <p className="px-6 text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.25em] text-muted">
              Portrait — add public/portrait.jpg
            </p>
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
      <div className="flex items-baseline justify-between border-t border-line px-6 py-4">
        <span className="text-sm font-medium">{profile.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {profile.companyShort} · {profile.location.split(",")[0]}
        </span>
      </div>
    </TiltCard>
  );
}
