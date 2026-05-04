"use client";
import dynamic from "next/dynamic";

const AmbientCanvas = dynamic(() => import("./AmbientCanvas"), { ssr: false });

export default function AmbientCanvasLoader() {
  return <AmbientCanvas />;
}
