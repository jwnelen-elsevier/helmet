"use client";
import CreateProjectModal from "@/app/_components/project/newProjectModal";
import CopyableText from "@/app/_components/ui/copyableText";
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
        <div
          key={i}
          className="flex flex-row gap-2 justify-center items-center"
        >
          <p>{p?.projectName}</p>
          <CopyableText text={p?._id} />
        </div>
      ))}
    </div>
  );
};

export default DisplayProjects;
