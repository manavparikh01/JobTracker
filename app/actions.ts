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
