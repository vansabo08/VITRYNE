"use client";

import { useEffect, useRef } from "react";

export function TaglineReveal({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const words = ref.current?.querySelectorAll<HTMLElement>("[data-w]");
    if (!words) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-on");
            io.unobserve(e.target);
          }
        }
      },
      // Só activa a palavra quando passa a linha a 70% da altura do ecrã.
      { rootMargin: "0px 0px -30% 0px", threshold: 0.5 },
    );
    words.forEach((w) => io.observe(w));
    return () => io.disconnect();
  }, []);

  return (
    <p ref={ref} className="mx-auto max-w-3xl text-4xl font-bold md:text-6xl">
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, i) => (
            <span
              key={i}
              data-w
              className="inline-block text-ink/25 transition-colors duration-700 ease-fluid [&.is-on]:text-ink mr-[0.25em]"
            >
              {w}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
