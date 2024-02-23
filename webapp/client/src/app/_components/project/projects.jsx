"use client";
import CreateProjectModal from "@/app/_components/project/newProjectModal";
import { useSelectedProject } from "@/providers/project";

const DisplayProjects = () => {
  const { projects } = useSelectedProject();
  return (
    <div>
      <h1>Projects page</h1>
      <h3>Create a new project</h3>
      <CreateProjectModal />
      <h3 className="mt-10">Existing projects {`(${projects?.length})`}</h3>
      {projects?.map((p, i) => (
        <p key={p._id}>{p?.projectName}</p>
      ))}
    </div>
  );
};

export default DisplayProjects;
