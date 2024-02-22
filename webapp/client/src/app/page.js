import { fetchProjects } from "@/api/projects";
import DisplayProjects from "@/app/(components)/project/projects";

export default async function Page() {
  const projects = await fetchProjects();

  return (
    <div className="container text-center mx-auto">
      <h1>Welcom to the XAI Platform of LLMEX</h1>
      <DisplayProjects projectsIn={projects} />
    </div>
  );
}
