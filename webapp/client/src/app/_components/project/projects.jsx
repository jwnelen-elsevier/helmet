"use client";
import { Snippet } from "@nextui-org/snippet";
import CreateProjectModal from "app/_components/project/newProjectModal";
import { useSelectedProject } from "providers/project";

const DisplayProjects = () => {
  const { projects } = useSelectedProject();
  return (
    <div className="space-y-2">
      <h1>Projects page</h1>
      <h3 className="">Existing projects {`(${projects?.length})`}</h3>
      <div>
        {projects?.map((p, i) => (
          <p key={p._id}>{p?.projectName}</p>
        ))}
      </div>
      <h3>Load/create project from helmet</h3>
      <p>Create/load a new project can also be done in Jupyter notebook:</p>
      <Snippet symbol="" radius="sm" color="default">
        {`project_id = helmet.get_or_create_project(platform_url, project_name,
        "text_generation")`}
      </Snippet>
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
