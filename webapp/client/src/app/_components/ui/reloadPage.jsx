"use client";

import revalidate from "@/app/actions";
import { Button } from "@nextui-org/react";
// The useRouter hook should be imported from next/navigation and not next/router when using the App Router

const ReloadButton = () => {
  async function reloadFunction() {
    revalidate();
  }

  return (
    <Button variant="primary" onClick={(e) => reloadFunction()}>
      Reload
    </Button>
  );
};
export default ReloadButton;
