import { fetchProjects, createProject } from "@/api/projects";
import DisplayProjects from "@/app/_components/project/projects";

export default async function Page() {
  const projects = await fetchProjects();

  const createP = async (p) => {
    "use server";
    const newP = await createProject(p);
    if (newP.acknowledged) {
      return newP.insertedId;
    }
    return null;
  };

  return (
    <div className="container text-center mx-auto">
      <h1>Welcom to the XAI Platform of LLMEX</h1>
      <DisplayProjects projectsIn={projects} createNewProject={createP} />
    </div>
  );
}
