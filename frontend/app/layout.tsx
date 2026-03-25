import type { Metadata } from "next";
import "./globals.css";
import AmbientCanvasLoader from "@/components/AmbientCanvasLoader";

export const metadata: Metadata = {
  title: "Connect Sphere",
  description: "AI-Powered Personal Booking Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-dark text-white min-h-screen" suppressHydrationWarning>
        {children}
        <AmbientCanvasLoader />
      </body>
    </html>
  );
}



