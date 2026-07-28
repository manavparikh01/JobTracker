#!/usr/bin/env node
// Append new job leads to data/leads.json, de-duplicating by a stable slug so
// re-running the finder never creates duplicates. Pure file I/O — no database,
// no network — so it runs fine inside the scheduled-task sandbox.
//
// Usage:
//   node scripts/add-leads.mjs '<json>'        # JSON array (or {leads:[...]}) as an arg
//   node scripts/add-leads.mjs path/to.json    # ...or a path to a JSON file
//   cat new.json | node scripts/add-leads.mjs  # ...or piped on stdin
//
// Each incoming lead needs at least { company, role }. Optional:
//   location, salary, url, source, note, foundOn (defaults to today).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const LEADS_FILE = join(DATA_DIR, "leads.json");

function slug(company, role, url) {
  const base = `${company}|${role}|${url ?? ""}`.toLowerCase();
  return base
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

// --- read input ---
function readInput() {
  const arg = process.argv[2];
  let text;
  if (arg && existsSync(arg)) text = readFileSync(arg, "utf8");
  else if (arg) text = arg;
  else text = readFileSync(0, "utf8"); // stdin
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : (parsed.leads ?? []);
}

// --- load existing ---
function loadExisting() {
  if (!existsSync(LEADS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(LEADS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function main() {
  const incoming = readInput();
  if (!Array.isArray(incoming) || incoming.length === 0) {
    console.log("No leads provided. Nothing to do.");
    return;
  }

  const existing = loadExisting();
  const seen = new Set(existing.map((l) => l.id));

  let added = 0;
  for (const raw of incoming) {
    const company = String(raw.company ?? "").trim();
    const role = String(raw.role ?? "").trim();
    if (!company || !role) continue;

    const url = raw.url ? String(raw.url).trim() : "";
    const id = raw.id || slug(company, role, url);
    if (seen.has(id)) continue;
    seen.add(id);

    existing.push({
      id,
      company,
      role,
      location: String(raw.location ?? "").trim(),
      salary: raw.salary ? String(raw.salary).trim() : "",
      url,
      source: raw.source ? String(raw.source).trim() : "",
      note: raw.note ? String(raw.note).trim() : "",
      foundOn: raw.foundOn || today(),
    });
    added++;
  }

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(LEADS_FILE, JSON.stringify(existing, null, 2) + "\n");
  console.log(
    `Added ${added} new lead(s). ${incoming.length - added} were duplicates/invalid. Total: ${existing.length}.`,
  );
}

main();
