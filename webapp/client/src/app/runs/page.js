import Runs from "@/app/_components/runsList";
import { fetchRuns } from "@/api/runs";

export default async function Page({ searchParams }) {
  console.log(searchParams);
  const runs = await fetchRuns();
  return (
    <div className="container text-center mx-auto">
      <Runs runs={runs} params={searchParams}></Runs>
    </div>
  );
}
