"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const AmbientCanvas = dynamic(() => import("./AmbientCanvas"), { ssr: false });

export default function AmbientCanvasLoader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AmbientCanvas />;
}


