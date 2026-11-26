// Entry program for the make.fun bounty "Promote make.fun's make-your-own-bounty post on X".
// The X post itself is the entry; this program only hands its address to the house:
// it reads POST.json at the repository root, checks the address really is an X post
// address, and copies the file unchanged to /output/POST.json, where the gate reads it.

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = join(botDir, 'POST.json');

let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`POST.json is not readable JSON: ${(err as Error).message}`);
  process.exit(1);
}

const url = (parsed as { url?: unknown }).url;
const postAddress = /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/\d+$/;
if (typeof url !== 'string' || !postAddress.test(url)) {
  console.error('POST.json must hold {"url": "https://x.com/<handle>/status/<id>"}');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
const target = join(outputDir, 'POST.json');
copyFileSync(source, target);
console.log(`handed in the post: ${url} (${statSync(target).size} bytes copied)`);
