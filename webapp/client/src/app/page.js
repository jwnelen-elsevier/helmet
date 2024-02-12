import ModelCard from "@/app/_components/modelDetails";
import Runs from "@/app/_components/runsList";
import { fetchRuns } from "@/api/runs";
import { fetchModel } from "@/api/status";

export default async function Page() {
  const runs = await fetchRuns();
  const model = await fetchModel();

  return (
    <div className="container text-center mx-auto">
      <ModelCard model={model}></ModelCard>
      <Runs runs={runs}></Runs>
    </div>
  );
}
