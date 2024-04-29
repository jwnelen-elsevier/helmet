import Runs from "app/_components/runs/runsTable";
import { fetchRuns } from "app/actions/actions";

export default async function Page({ searchParams }) {
  const runs = await fetchRuns();

  return (
    <div className="container text-center mx-auto mb-10">
      <Runs runs={runs} params={searchParams}></Runs>
    </div>
  );
}
