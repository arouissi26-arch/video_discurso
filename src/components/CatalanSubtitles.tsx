import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions, type TikTokPage } from "@remotion/captions";
import { CAPTIONS } from "../lib/captions-data";
import { ensureFontsLoaded } from "../lib/fonts";
import {
  KEYWORD_ROLES,
  THEME,
  getAccentColors,
  type AccentRole,
} from "../theme";
import type { LayoutMode } from "../timeline";

function cleanWord(raw: string): string {
  return raw
    .trim()
    .replace(/^[^A-Za-zÀ-ÿ0-9·']+|[^A-Za-zÀ-ÿ0-9·']+$/g, "")
    .toUpperCase();
}

function stripArticle(upper: string): string {
  return upper.replace(/^[LDNSMT]['’]/, "");
}

function isAuthoredThematicKeyword(raw: string): boolean {
  return /[A-ZÀÈÉÍÏÒÓÚÜÇ]{2,}/.test(raw.trim());
}

function detectTokenRoles(tokens: TikTokPage["tokens"]): (AccentRole | null)[] {
  const roles: (AccentRole | null)[] = new Array(tokens.length).fill(null);
  const cleaned = tokens.map((t) => cleanWord(t.text));
  const stripped = cleaned.map(stripArticle);
  const authoredUpper = tokens.map((t) => isAuthoredThematicKeyword(t.text));

  for (let i = 0; i < tokens.length; i++) {
    if (!authoredUpper[i]) continue;
    for (const entry of KEYWORD_ROLES) {
      if (
        entry.words.length === 2 &&
        i + 1 < tokens.length &&
        authoredUpper[i + 1]
      ) {
        const w0 = entry.words[0];
        const w1 = entry.words[1];
        if (
          (cleaned[i] === w0 || stripped[i] === w0) &&
          (cleaned[i + 1] === w1 || stripped[i + 1] === w1)
        ) {
          roles[i] = entry.role;
          roles[i + 1] = entry.role;
          break;
        }
      } else if (entry.words.length === 1 && roles[i] === null) {
        const w0 = entry.words[0];
        if (cleaned[i] === w0 || stripped[i] === w0) {
          roles[i] = entry.role;
          break;
        }
      }
    }
  }
  return roles;
}

function getMarkerPalette(role: AccentRole): { bg: string; fg: string } {
  switch (role) {
    case "lime":
      return { bg: THEME.colors.lime, fg: THEME.colors.onAccentDark };
    case "red":
      return { bg: THEME.colors.red, fg: THEME.colors.onAccentDark };
    case "blue":
      return { bg: THEME.colors.blueText, fg: THEME.colors.onAccentDark };
  }
}

interface WordRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CatalanSubtitles: React.FC<{
  sectionAccent: AccentRole;
  layoutMode: LayoutMode;
}> = ({ sectionAccent, layoutMode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  const pages = useMemo(() => {
    const { pages: built } = createTikTokStyleCaptions({
      captions: CAPTIONS,
      combineTokensWithinMilliseconds: 99999,
    });
    return built;
  }, []);

  const activePage = useMemo(() => {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const endMs = page.startMs + page.durationMs;
      if (currentTimeMs >= page.startMs - 40 && currentTimeMs <= endMs + 120) {
        return page;
      }
    }
    return null;
  }, [pages, currentTimeMs]);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [rects, setRects] = useState<WordRect[]>([]);
  const [boxInnerSize, setBoxInnerSize] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  });
  const [measureHandle, setMeasureHandle] = useState<number | null>(null);

  const pageKey = activePage
    ? `${activePage.startMs}-${activePage.tokens.length}`
    : "none";

  useLayoutEffect(() => {
    if (!activePage) {
      setRects([]);
      return;
    }
    let cancelled = false;
    const handle = delayRender(`Measure subtitle tokens ${pageKey}`);
    setMeasureHandle(handle);

    const measureNow = () => {
      if (cancelled) return;
      const boxEl = boxRef.current;
      if (!boxEl) {
        continueRender(handle);
        setMeasureHandle(null);
        return;
      }
      const boxBounds = boxEl.getBoundingClientRect();
      const scaleFactor =
        boxEl.offsetWidth > 0 ? boxBounds.width / boxEl.offsetWidth : 1;

      setBoxInnerSize({
        w: boxEl.clientWidth,
        h: boxEl.clientHeight,
      });

      const measured: WordRect[] = activePage.tokens.map((_, idx) => {
        const el = wordRefs.current[idx];
        if (!el) return { x: 0, y: 0, width: 0, height: 0 };
        const wb = el.getBoundingClientRect();
        return {
          x: (wb.left - boxBounds.left) / scaleFactor - THEME.layout.borderWidth,
          y: (wb.top - boxBounds.top) / scaleFactor - THEME.layout.borderWidth,
          width: wb.width / scaleFactor,
          height: wb.height / scaleFactor,
        };
      });
      setRects(measured);
      continueRender(handle);
      setMeasureHandle(null);
    };

    Promise.all([
      ensureFontsLoaded(),
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve(),
    ])
      .then(() => {
        measureNow();
      })
      .catch(() => {
        measureNow();
      });

    return () => {
      cancelled = true;
      continueRender(handle);
    };
  }, [pageKey, activePage]);

  if (!activePage) return null;

  const tokens = activePage.tokens;
  const tokenRoles = detectTokenRoles(tokens);

  let activeIdx = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (currentTimeMs >= tokens[i].fromMs - 20) {
      activeIdx = i;
    }
  }
  const prevIdx = Math.max(0, activeIdx - 1);
  const activeToken = tokens[activeIdx];
  const slideProgress = interpolate(
    currentTimeMs,
    [activeToken.fromMs - 15, activeToken.fromMs + 95],
    [0, 1],
    {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const currRect = rects[activeIdx] ?? { x: 0, y: 0, width: 0, height: 0 };
  const prevRect = rects[prevIdx] ?? currRect;
  const sameLine = Math.abs(currRect.y - prevRect.y) < 18;

  const markerX = sameLine
    ? interpolate(slideProgress, [0, 1], [prevRect.x, currRect.x])
    : currRect.x;
  const markerY = currRect.y;
  const markerW = sameLine
    ? interpolate(slideProgress, [0, 1], [prevRect.width, currRect.width])
    : currRect.width;
  const markerH = currRect.height;

  const activeWordRole = tokenRoles[activeIdx] ?? sectionAccent;
  const markerPalette = getMarkerPalette(activeWordRole);

  const lines: { idx: number; raw: string }[][] = [[]];
  tokens.forEach((tok, idx) => {
    const hasLeadingNewline = tok.text.startsWith("\n");
    if (hasLeadingNewline && lines[lines.length - 1].length > 0) {
      lines.push([]);
    }
    lines[lines.length - 1].push({
      idx,
      raw: tok.text.trim(),
    });
  });

  const pageAgeMs = Math.max(0, currentTimeMs - activePage.startMs);
  const popIn = interpolate(pageAgeMs, [0, 110], [0.97, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bottomOffset =
    layoutMode === "C" || layoutMode === "E"
      ? THEME.layout.safeY + 12
      : THEME.layout.safeY + 26;

  wordRefs.current.length = tokens.length;

  // Coordenades exactes del clip-path track-matte (dins la caixa padding-box de boxRef)
  const mLeft = Math.max(0, markerX - 4);
  const mTop = Math.max(0, markerY - 2);
  const mRight = Math.max(0, boxInnerSize.w - (markerX + markerW + 4));
  const mBottom = Math.max(0, boxInnerSize.h - (markerY + markerH + 2));

  const renderLines = (asStencilDark: boolean) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      {lines.map((line, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "baseline",
            columnGap: 12,
            whiteSpace: "nowrap",
          }}
        >
          {line.map(({ idx, raw }) => {
            const kwRole = tokenRoles[idx];
            const kwPalette = kwRole ? getAccentColors(kwRole) : null;

            const textColor = asStencilDark
              ? markerPalette.fg
              : kwPalette
              ? kwPalette.textOnDark
              : THEME.colors.textPrimary;

            return (
              <span
                key={idx}
                ref={
                  asStencilDark
                    ? undefined
                    : (el) => {
                        wordRefs.current[idx] = el;
                      }
                }
                style={{
                  display: "inline-block",
                  fontFamily: THEME.fonts.subtitle,
                  fontWeight: THEME.fontWeights.subtitle,
                  fontSize: THEME.typeScale.subtitle,
                  lineHeight: THEME.lineHeights.subtitle,
                  letterSpacing: THEME.tracking.subtitleTight,
                  color: textColor,
                  padding: "2px 4px",
                  borderBottom:
                    kwPalette && !asStencilDark
                      ? `3px solid ${kwPalette.textOnDark}`
                      : "3px solid transparent",
                }}
              >
                {raw}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: THEME.layout.safeX,
        right: THEME.layout.safeX,
        bottom: bottomOffset,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 70,
        opacity: measureHandle !== null ? 0 : 1,
      }}
    >
      <div
        ref={boxRef}
        style={{
          position: "relative",
          backgroundColor:
            layoutMode === "C" || layoutMode === "E"
              ? THEME.colors.ink
              : "rgba(10, 10, 11, 0.92)",
          border: `${THEME.layout.borderWidth}px solid ${
            layoutMode === "C" || layoutMode === "E"
              ? markerPalette.bg
              : THEME.colors.line
          }`,
          padding: "16px 26px",
          maxWidth: THEME.layout.usableWidth,
          transform: `scale(${popIn})`,
          transformOrigin: "center bottom",
        }}
      >
        {/* Capa base: text blanc + paraules clau acolorides */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {renderLines(false)}
        </div>

        {/* Capa Track-Matte: marcador sòlid lliscant amb text #0A0A0B retallat al subpíxel! */}
        {markerW > 0 && boxInnerSize.w > 0 && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              padding: "16px 26px",
              backgroundColor: markerPalette.bg,
              clipPath: `inset(${mTop.toFixed(2)}px ${mRight.toFixed(
                2
              )}px ${mBottom.toFixed(2)}px ${mLeft.toFixed(2)}px)`,
              zIndex: 2,
            }}
          >
            {renderLines(true)}
          </div>
        )}
      </div>
    </div>
  );
};
