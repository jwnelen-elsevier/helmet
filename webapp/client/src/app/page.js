import ModelCard from "@/app/_components/ModelCard";
import Runs from "@/app/_components/Runs";

export default async function Page() {
  return (
    <div className="w-full h-full text-center m-auto">
      <ModelCard></ModelCard>
      <Runs></Runs>
    </div>
  );
}
