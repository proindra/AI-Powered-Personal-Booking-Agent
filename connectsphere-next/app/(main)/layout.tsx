import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import Script from "next/script";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollEffects />
      <Script
        src="https://unpkg.com/@studio-freight/lenis@1.0.35/dist/lenis.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}


