"use client";
import { Button } from "@nextui-org/react";
import { BackIcon } from "app/_components/ui/icons";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="bg-white"
      color="default"
      variant="bordered"
      startContent={<BackIcon />}
      onClick={() => router.back()}
    >
      Back
    </Button>
  );
}
