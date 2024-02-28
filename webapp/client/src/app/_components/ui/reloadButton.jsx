"use client";
import { RefreshIcon } from "@/app/_components/ui/icons";
import { Button, Tooltip } from "@nextui-org/react";

const ReloadButton = () => {
  return (
    <Tooltip content="Refresh" position="bottom">
      <Button
        onClick={() => {
          location.reload();
        }}
        isIconOnly
        aria-label="refresh"
        size="sm"
        className="ml-2"
      >
        <RefreshIcon />
      </Button>
    </Tooltip>
  );
};
export default ReloadButton;
