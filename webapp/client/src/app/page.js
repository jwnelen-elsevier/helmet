import DisplayProjects from "@/app/_components/project/projects";
import StatusIndicator from "@/app/_components/ui/Status";
import ReloadPage from "@/app/_components/ui/reloadPage";

export default async function Page() {
  return (
    <div className="container text-center mx-auto">
      <ReloadPage />
      <StatusIndicator></StatusIndicator>
      <DisplayProjects />
    </div>
  );
}
