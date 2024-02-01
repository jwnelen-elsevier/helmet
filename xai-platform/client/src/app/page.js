import { StatusIndicator } from "@/app/_components/ui/Status";

export default async function Page() {
  return (
    <div className="w-full h-full text-center m-auto">
      Could not load data Model name: <br></br>
      <StatusIndicator></StatusIndicator>
    </div>
  );
}
