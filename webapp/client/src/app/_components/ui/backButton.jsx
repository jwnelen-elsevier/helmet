"use client";
import { BackIcon } from "@/app/_components/ui/icons";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      className=""
      color="default"
      variant="bordered"
      startContent={<BackIcon />}
      onClick={() => router.back()}
    >
      Back
    </Button>
  );
}
