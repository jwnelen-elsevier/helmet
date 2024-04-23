"use client";
import CreateProjectModal from "app/_components/project/newProjectModal";
import { useSelectedProject } from "providers/project";

const DisplayProjects = () => {
  const { projects } = useSelectedProject();
  return (
    <div className="">
      <h1>Projects page</h1>
      <h3 className="">Existing projects {`(${projects?.length})`}</h3>
      {projects?.map((p, i) => (
        <p key={p._id}>{p?.projectName}</p>
      ))}
      <h3>Create a new project</h3>
      <p className="italic mb-4">
        Its adviced to create a project for every task you are solving. You can
        have multiple models within the same project
      </p>
      <CreateProjectModal />
    </div>
  );
};

export default DisplayProjects;
