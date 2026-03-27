import BookingPageClient from "@/components/BookingPageClient";

export default function BookingStandalonePage() {
  return (
    <main className="w-full h-[100dvh] overflow-hidden text-white relative p-0 m-0">
      {/* Ambient Glow Blobs — same blue/green vibe as the main page AmbientCanvas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Blue blob — top-left */}
        <div className="absolute top-[10%] left-[10%] w-[700px] h-[600px] bg-[#0066FF] rounded-full opacity-25 blur-[140px]" />
        {/* Green blob — centre-right */}
        <div className="absolute top-[40%] right-[5%] w-[600px] h-[550px] bg-[#39ff14] rounded-full opacity-18 blur-[150px]" />
        {/* Blue accent — bottom-left */}
        <div className="absolute bottom-[0%] left-[5%] w-[400px] h-[350px] bg-[#0066FF] rounded-full opacity-20 blur-[120px]" />
      </div>

      {/* UI content sits above the glow */}
      <div className="relative z-10 w-full h-full">
        <BookingPageClient />
      </div>
    </main>
  );
}
