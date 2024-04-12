import DetailDisplayer from "app/_components/details/detailDisplayer";
import { fetchRun } from "app/actions/actions";

export default async function Page({ params }) {
  const runDetails = await fetchRun(params.id);

  if (!runDetails) {
    return <div>Run not found</div>;
  }

  return (
    <div className="container mx-auto">
      <DetailDisplayer props={runDetails} />
    </div>
  );
}
