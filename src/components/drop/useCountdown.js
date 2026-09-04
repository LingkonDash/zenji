"use client";

import { useEffect, useState } from "react";

export function getTimeParts(target) {
  const targetMs = typeof target === "string" ? new Date(target).getTime() : target;
  const diff = Math.max(targetMs - Date.now(), 0);
  return {
    diff,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export const pad = (n) => String(n).padStart(2, "0");

export function useCountdown(target) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (!target) return;
    const targetMs = typeof target === "string" ? new Date(target).getTime() : target;
    const tick = () => setTime(getTimeParts(targetMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return {
    time,
    isLive: time ? time.diff <= 0 : false,
  };
}
