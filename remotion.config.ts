import { Config } from "@remotion/cli/config";
import fs from "node:fs";

Config.setPublicDir(".cache/public");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setCrf(18);
Config.setAudioCodec("aac");
Config.setAudioBitrate("192k");
Config.setPixelFormat("yuv420p");

// Si existeix el Chromium empaquetat per @sparticuz/chromium a l'entorn Linux sense X11, l'usem automàticament
if (fs.existsSync("/tmp/chromium")) {
  Config.setBrowserExecutable("/tmp/chromium");
}
