"use client";

import dynamic from "next/dynamic";

// ssr: false must live in a Client Component — this wrapper satisfies that rule
const BirthdayExperience = dynamic(() => import("./BirthdayExperience"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />,
});

export default function ClientLoader() {
  return <BirthdayExperience />;
}
