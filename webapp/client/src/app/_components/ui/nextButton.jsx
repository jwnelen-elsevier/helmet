"use client";
import { useRouter } from "next/navigation";
import { NextIcon } from "@/app/_components/ui/icons";

export default function NextButton() {
  const router = useRouter();

  return (
    <button
      className="text-center inline-flex items-center outline px-2 pl-3 py-1 rounded-xl hover:bg-slate-200"
      onClick={() => router.forward()}
    >
      Next <NextIcon />
    </button>
  );
}
