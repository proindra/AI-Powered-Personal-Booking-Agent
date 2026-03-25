import SignInNavbar from "@/components/SignInNavbar";
import AmbientCanvasLoader from "@/components/AmbientCanvasLoader";
import ScrollEffects from "@/components/ScrollEffects";
import Script from "next/script";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignInNavbar />
      {children}
      <AmbientCanvasLoader />
      <ScrollEffects />
      <Script
        src="https://unpkg.com/@studio-freight/lenis@1.0.35/dist/lenis.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}


