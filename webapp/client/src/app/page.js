"use client"; // This is needed to find the useSelectedProject hook
import DisplayProjects from "@/app/_components/project/projects";
import { useSelectedProject } from "@/providers/project";

export default async function Page() {
  const { projects } = useSelectedProject();

  return (
    <div className="container text-center mx-auto">
      <h1>Welcom to the XAI Platform of LLMEX</h1>
      <DisplayProjects projects={projects} />
    </div>
  );
}
