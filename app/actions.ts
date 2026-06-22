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
  revalidatePath("/");
}

export async function updateApplicationStatus(id: string, status: string) {
  await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/");
}

export async function deleteApplication(id: string) {
  await prisma.application.delete({ where: { id } });
  revalidatePath("/");
}

// --- Daily todos ---

export async function addTodo(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  await prisma.todo.create({ data: { text, day: dateKey() } });
  revalidatePath("/");
}

export async function toggleTodo(id: string, done: boolean) {
  await prisma.todo.update({ where: { id }, data: { done } });
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({ where: { id } });
  revalidatePath("/");
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
  revalidatePath("/");
}
