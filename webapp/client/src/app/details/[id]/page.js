import { fetchRun } from "@/api/runs";
import DetailDisplayer from "@/app/_components/detailDisplayer";

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
