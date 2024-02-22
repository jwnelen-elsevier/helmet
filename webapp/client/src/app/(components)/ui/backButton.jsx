"use client";
import { useRouter } from "next/navigation";
import { BackIcon } from "@/app/(components)/ui/icons";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="text-center inline-flex items-center outline px-2 pr-3 py-1 rounded-xl hover:bg-slate-200"
      onClick={() => router.back()}
    >
      <BackIcon /> Back
    </button>
  );
}
