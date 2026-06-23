import { notFound } from "next/navigation";
import { DayDashboard } from "@/components/DayDashboard";

export const dynamic = "force-dynamic";

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  return <DayDashboard day={date} />;
}
