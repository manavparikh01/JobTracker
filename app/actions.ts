"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { dateKey } from "@/lib/plan";

// --- Applications ---

export async function addApplication(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  if (!company || !role) return;

  const dateStr = String(formData.get("dateApplied") ?? "").trim();

  await prisma.application.create({
    data: {
      company,
      role,
      referral: formData.get("referral") === "on",
      dateApplied: dateStr ? new Date(dateStr) : new Date(),
      link: String(formData.get("link") ?? "").trim() || null,
    },
  });
  revalidatePath("/", "layout");
}

export async function updateApplicationStatus(id: string, status: string) {
  await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/", "layout");
}

export async function deleteApplication(id: string) {
  await prisma.application.delete({ where: { id } });
  revalidatePath("/", "layout");
}

// --- Daily todos ---

export async function addTodo(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  const day = String(formData.get("day") ?? "").trim() || dateKey();
  await prisma.todo.create({ data: { text, day } });
  revalidatePath("/", "layout");
}

export async function toggleTodo(id: string, done: boolean) {
  await prisma.todo.update({ where: { id }, data: { done } });
  revalidatePath("/", "layout");
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({ where: { id } });
  revalidatePath("/", "layout");
}

// --- Reading list ---

export async function toggleReadingItem(itemId: string, done: boolean) {
  await prisma.readingProgress.upsert({
    where: { itemId },
    create: { itemId, done },
    update: { done },
  });
  revalidatePath("/", "layout");
}

export async function setReadingComment(itemId: string, comment: string) {
  const value = comment.trim() || null;
  await prisma.readingProgress.upsert({
    where: { itemId },
    create: { itemId, comment: value },
    update: { comment: value },
  });
  revalidatePath("/", "layout");
}

// --- Job leads ---

// Mark a lead as applied. This is the whole point of the leads page: instead of
// re-typing the job into Applications, one click both (a) records the lead as
// "applied" so it drops off the active leads list, and (b) creates the matching
// Application row so it shows up in your pipeline immediately.
export async function markLeadApplied(lead: {
  id: string;
  company: string;
  role: string;
  url?: string | null;
}) {
  await prisma.$transaction([
    prisma.application.create({
      data: {
        company: lead.company,
        role: lead.role,
        link: lead.url?.trim() || null,
      },
    }),
    prisma.leadStatus.upsert({
      where: { leadId: lead.id },
      create: { leadId: lead.id, status: "applied" },
      update: { status: "applied" },
    }),
  ]);
  revalidatePath("/", "layout");
}

// Set a lead's triage state directly (used for Dismiss and for undoing).
export async function setLeadStatus(leadId: string, status: string) {
  await prisma.leadStatus.upsert({
    where: { leadId },
    create: { leadId, status },
    update: { status },
  });
  revalidatePath("/", "layout");
}

// --- LeetCode counter ---

export async function bumpLeetcode(delta: number) {
  const existing = await prisma.counter.findUnique({ where: { key: "leetcode" } });
  const value = Math.max(0, (existing?.value ?? 0) + delta);
  await prisma.counter.upsert({
    where: { key: "leetcode" },
    create: { key: "leetcode", value },
    update: { value },
  });
  revalidatePath("/", "layout");
}
