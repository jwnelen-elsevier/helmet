import Runs from "@/app/_components/runsTable";
import { fetchRuns } from "@/api/runs";

export default async function Page({ searchParams }) {
  const runs = await fetchRuns();

  return (
    <div className="container text-center mx-auto">
      <Runs runs={runs} params={searchParams}></Runs>
    </div>
  );
}
