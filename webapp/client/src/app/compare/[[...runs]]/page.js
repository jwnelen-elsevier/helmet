import DetailDisplayer from "app/_components/details/detailDisplayer";
import PageNav from "app/_components/layout/pageNav";
import { fetchRun } from "app/actions/actions";

export default async function Page({ params: { runs: runs } }) {
  const canCompare = runs.length == 2;
  if (!canCompare) {
    return <div>Cannot compare 1 or more than 2 runs</div>;
  }

  const run1 = await fetchRun(runs[0]);
  const run2 = await fetchRun(runs[1]);

  if (!run1 || !run2) {
    return <div>Run not found</div>;
  }

  return (
    <div>
      <PageNav />
      <div className="flex divide-x-2 divide-solid justify-center">
        <DetailDisplayer props={run1} />
        <DetailDisplayer props={run2} />
      </div>
    </div>
  );
}
