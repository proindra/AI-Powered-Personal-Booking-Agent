"use client";
import { useState } from "react";
import BookingChat from "./BookingChat";
import Link from "next/link";

const quickPrompts = [
  "Book a session with Elon Musk next Tuesday",
  "Find available slots for a design workshop",
  "Schedule a networking call this Friday at 3pm",
  "Check availability for August 20th event",
];

export default function BookingPageClient() {
  return (
    <div className="w-full h-full text-white">
      <BookingChat />
    </div>
  );
}


