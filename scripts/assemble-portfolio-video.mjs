// Assemble the optimized web video from GitHub-sized binary chunks during build.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const chunks = Array.from({ length: 9 }, (_, i) =>
  readFileSync(resolve("media/portfolio-video/part-" + String(i).padStart(2, "0") + ".bin"))
);
const video = Buffer.concat(chunks);
const digest = createHash("sha256").update(video).digest("hex");
const expected = "d4e023ae0babf2ed8f95b446d22a9e22261bab1ca6f087ab89b42bac448897e9";
if (video.length !== 10296021 || digest !== expected) {
  throw new Error("Portfolio video integrity check failed: " + digest);
}
const target = resolve("app/public/assets/damage-assessment.mp4");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, video);
console.log("Portfolio video ready: " + video.length + " bytes (480p MP4, verified).");
