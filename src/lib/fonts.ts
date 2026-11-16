import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
// Referències de família compatibles amb @remotion/google-fonts i càrrega local determinista sense xarxa
import * as BricolageGoogle from "@remotion/google-fonts/BricolageGrotesque";
import * as InstrumentGoogle from "@remotion/google-fonts/InstrumentSerif";
import * as JetBrainsGoogle from "@remotion/google-fonts/JetBrainsMono";
import * as InterTightGoogle from "@remotion/google-fonts/InterTight";

export const GOOGLE_FONT_META = {
  display: BricolageGoogle.fontFamily,
  editorial: InstrumentGoogle.fontFamily,
  mono: JetBrainsGoogle.fontFamily,
  subtitle: InterTightGoogle.fontFamily,
};

let fontsLoadedPromise: Promise<unknown> | null = null;

/**
 * Carrega els pesos exactes usats (Bricolage Grotesque 800, Instrument Serif 400 italic,
 * JetBrains Mono 500, Inter Tight 800) des de public/fonts/*.woff2 amb @remotion/fonts
 * (que sincronitza amb delayRender/continueRender i garanteix el punt volat "l·l").
 */
export function ensureFontsLoaded(): Promise<unknown> {
  if (!fontsLoadedPromise) {
    fontsLoadedPromise = Promise.all([
      loadFont({
        family: "Bricolage Grotesque",
        url: staticFile("fonts/bricolage-grotesque-latin-800.woff2"),
        weight: "800",
        style: "normal",
      }),
      loadFont({
        family: "Bricolage Grotesque",
        url: staticFile("fonts/bricolage-grotesque-latin-ext-800.woff2"),
        weight: "800",
        style: "normal",
      }),
      loadFont({
        family: "Instrument Serif",
        url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"),
        weight: "400",
        style: "italic",
      }),
      loadFont({
        family: "Instrument Serif",
        url: staticFile("fonts/instrument-serif-latin-ext-400-italic.woff2"),
        weight: "400",
        style: "italic",
      }),
      loadFont({
        family: "JetBrains Mono",
        url: staticFile("fonts/jetbrains-mono-latin-500.woff2"),
        weight: "500",
        style: "normal",
      }),
      loadFont({
        family: "JetBrains Mono",
        url: staticFile("fonts/jetbrains-mono-latin-ext-500.woff2"),
        weight: "500",
        style: "normal",
      }),
      loadFont({
        family: "Inter Tight",
        url: staticFile("fonts/inter-tight-latin-800.woff2"),
        weight: "800",
        style: "normal",
      }),
      loadFont({
        family: "Inter Tight",
        url: staticFile("fonts/inter-tight-latin-ext-800.woff2"),
        weight: "800",
        style: "normal",
      }),
    ]);
  }
  return fontsLoadedPromise;
}
