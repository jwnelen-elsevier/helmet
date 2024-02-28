"use client";

import { Button } from "@nextui-org/react";
// The useRouter hook should be imported from next/navigation and not next/router when using the App Router

const ReloadButton = () => {
  return (
    <Button
      onClick={() => {
        location.reload();
      }}
      variant="primary"
    >
      Reload
    </Button>
  );
};
export default ReloadButton;
