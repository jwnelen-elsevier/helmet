import DetailDisplayer from "app/_components/details/detailDisplayer";
import PageNav from "app/_components/layout/pageNav";
import { fetchRun } from "app/actions/actions";

export default async function Page({ params }) {
  const runDetails = await fetchRun(params.id);

  if (!runDetails) {
    return <div>Run not found</div>;
  }

  return (
    <div className="container mx-auto">
      <PageNav />
      <DetailDisplayer props={runDetails} />
    </div>
  );
}
