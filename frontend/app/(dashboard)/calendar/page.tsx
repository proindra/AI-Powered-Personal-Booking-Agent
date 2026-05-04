"use client";
import FullCalendarDashboard from "@/components/calendar/FullCalendarDashboard";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/events");
  };

  const handleDisconnect = () => {
    localStorage.removeItem("calendar_token");
    window.location.reload();
  };

  return (
    <div className="h-full w-full flex flex-col">
      <FullCalendarDashboard onBack={handleBack} onDisconnect={handleDisconnect} />
    </div>
  );
}
