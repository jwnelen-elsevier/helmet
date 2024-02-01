import { StatusIndicator } from "@/app/_components/ui/Status";
import ModelCard from "./_components/ModelCard";

export default async function Page() {
  return (
    <div className="w-full h-full text-center m-auto">
      Could not load data Model name: <br></br>
      <StatusIndicator></StatusIndicator>
      <ModelCard></ModelCard>
    </div>
  );
}
