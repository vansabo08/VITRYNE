"use client";

import { useEffect } from "react";
import { registarVisita } from "@/lib/track";

export function TrackVisit({ lojaId, produtoId }: { lojaId: string; produtoId?: string }) {
  useEffect(() => {
    registarVisita({ lojaId, produtoId });
  }, [lojaId, produtoId]);
  return null;
}
