import { DayDashboard } from "@/components/DayDashboard";
import { dateKey } from "@/lib/plan";

// Always render with fresh data from the DB.
export const dynamic = "force-dynamic";

export default async function Home() {
  return <DayDashboard day={dateKey()} />;
}
