import type { Metadata } from "next";
import "./globals.css";
import AmbientCanvasLoader from "@/components/3d/AmbientCanvasLoader";

export const metadata: Metadata = {
  title: "4th Dimension Workspace",
  description: "AI-Powered Personal Booking Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="font-sans bg-dark text-white min-h-screen" suppressHydrationWarning>
        {children}
        <AmbientCanvasLoader />
      </body>
    </html>
  );
}



