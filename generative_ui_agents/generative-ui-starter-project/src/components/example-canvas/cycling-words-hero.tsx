"use client";

import { useEffect, useRef } from "react";

const WORDS = ["OCHLAZENÍ", "DESIGN", "INOVACE", "KOMFORT"];
const DURATION_MS = 550;
const INTERVAL_MS = 3000;
const LETTER_DELAY = 0.045; // seconds per letter stagger

export function CyclingWordsHero() {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const currentRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (words.length < 2) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    // Fit each word to the available width — shrink font-size if a word
    // would overflow, never below the 14px floor.
    function fitWords() {
      const available = wrap!.clientWidth;
      if (!available) return;
      words.forEach((w) => (w.style.fontSize = ""));
      const naturalPx = parseFloat(getComputedStyle(wrap!).fontSize);
      words.forEach((w) => {
        const prevDisplay = w.style.display;
        const prevVisibility = w.style.visibility;
        w.style.visibility = "hidden";
        w.style.display = "block";
        const natural = w.scrollWidth;
        w.style.display = prevDisplay;
        w.style.visibility = prevVisibility;
        if (natural > available) {
          w.style.fontSize =
            Math.max(14, (naturalPx * available * 0.98) / natural) + "px";
        }
      });
    }

    fitWords();
    window.addEventListener("resize", fitWords);
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(fitWords);
      ro.observe(wrap);
    }

    // Cache the longest per-letter transition-delay in each word
    const delayCache = new WeakMap<Element, number>();
    function maxDelayMs(wordEl: Element): number {
      if (delayCache.has(wordEl)) return delayCache.get(wordEl)!;
      let max = 0;
      wordEl.querySelectorAll(".cwh-letter").forEach((letter) => {
        const d = parseFloat(getComputedStyle(letter).transitionDelay) * 1000;
        if (d > max) max = d;
      });
      delayCache.set(wordEl, max);
      return max;
    }

    let timer: ReturnType<typeof setInterval> | null = null;

    function step() {
      const currentEl = words[currentRef.current];
      const nextIndex = (currentRef.current + 1) % words.length;
      const nextEl = words[nextIndex];

      // Snap next word's letters below the mask (no transition), reveal,
      // force reflow, then let them animate back to rest.
      nextEl.classList.add("cwh-enter-start");
      nextEl.classList.add("cwh-visible");
      void nextEl.offsetWidth;
      nextEl.classList.remove("cwh-enter-start");

      // Roll the outgoing word up and out.
      currentEl.classList.add("cwh-exit");

      // Wait for the LAST letter to finish before hiding the old word.
      setTimeout(() => {
        currentEl.classList.remove("cwh-visible", "cwh-exit");
        currentRef.current = nextIndex;
      }, DURATION_MS + maxDelayMs(currentEl));
    }

    function play() {
      timer = setInterval(step, INTERVAL_MS);
    }
    function pause() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Pause when scrolled off-screen.
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        entries[0].isIntersecting ? play() : pause();
      });
      io.observe(wrap);
    } else {
      play();
    }

    return () => {
      if (timer) clearInterval(timer);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener("resize", fitWords);
    };
  }, []);

  return (
    <section className="cwh-scene">
      <style>{`
        .cwh-scene {
          container-type: inline-size;
          container-name: cwh;
          display: grid;
          grid-template-rows: auto 120px;
          gap: 16px;
          padding: 20px;
          border-radius: var(--radius);
          background: var(--accent);
          color: var(--foreground);
          margin-bottom: 24px;
        }

        .cwh-eyebrow {
          margin: 0 0 12px;
          font-family: var(--font-body);
          font-style: italic;
          font-weight: 400;
          line-height: normal;
          color: var(--muted-foreground);
          font-size: 14px;
        }
        @container cwh (min-width: 640px) {
          .cwh-eyebrow { font-size: 22px; }
        }

        .cwh-wrap {
          position: relative;
          display: block;
          width: 100%;
          height: 1em;
          overflow: hidden;
          vertical-align: top;
          color: var(--foreground);
          font-size: clamp(14px, 8vw, 4rem);
          font-weight: 800;
          font-family: var(--font-body);
          line-height: 1;
          text-box: trim-both cap alphabetic;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }
        .cwh-word {
          position: absolute;
          inset: 0;
          display: none;
          white-space: nowrap;
        }
        .cwh-word.cwh-visible { display: block; }
        .cwh-letter {
          display: inline-block;
          white-space: pre;
          transform: translateY(0);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cwh-word.cwh-enter-start .cwh-letter {
          transition: none;
          transform: translateY(100%);
        }
        .cwh-word.cwh-exit .cwh-letter {
          transform: translateY(-100%);
        }

        @media (prefers-reduced-motion: reduce) {
          .cwh-word .cwh-letter { transition: none; }
        }

        .cwh-photo {
          width: 100%;
          height: 100%;
          min-height: 0;
          border-radius: 8px;
          background: linear-gradient(135deg, #4a90c2 0%, #85ecce 50%, #b8e0f0 100%);
          position: relative;
          overflow: hidden;
        }
        .cwh-photo::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 30% 40%,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 50%
          );
        }
      `}</style>

      <div>
        <p className="cwh-eyebrow">MLŽENÍ, KTERÉ DÁVÁ SMYSL</p>
        <span className="cwh-wrap" ref={wrapRef}>
          {WORDS.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className={`cwh-word${i === 0 ? " cwh-visible" : ""}`}
            >
              {word.split("").map((letter, j) => (
                <span
                  key={j}
                  className="cwh-letter"
                  style={{ transitionDelay: `${j * LETTER_DELAY}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </span>
      </div>

      <div className="cwh-photo" aria-hidden="true" />
    </section>
  );
}
