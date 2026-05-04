import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollEffects from "@/components/layout/ScrollEffects";
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


