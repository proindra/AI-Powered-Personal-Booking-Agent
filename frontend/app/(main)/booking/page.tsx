import BookingPageClient from "@/components/BookingPageClient";

export default function BookingPage() {
  return (
    <main className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto">
      <section className="mb-16">
        <span className="font-bold text-brand uppercase tracking-[0.3em] text-xs">AI-Powered</span>
        <h1 className="font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tighter text-white mt-4 mb-6">
          BOOK A<br /><span className="text-brand">SESSION</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
          Our LangGraph-powered booking agent understands natural language. Just tell it what you need — it handles availability, conflicts, and confirmations.
        </p>
      </section>
      <BookingPageClient />
    </main>
  );
}


