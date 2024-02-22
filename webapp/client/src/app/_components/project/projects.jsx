"use client";
import React, { useState } from "react";
import CreateProjectModal from "@/app/_components/project/projectModal";
import CopyableText from "@/app/_components/ui/copyableText";

const DisplayProjects = ({ projectsIn, createNewProject }) => {
  const [projects, setProjects] = useState(projectsIn);

  const createProject = async (p) => {
    // createProject server side
    const newProjectId = await createNewProject(p);
    if (!newProjectId) return;
    p["id"] = newProjectId;
    setProjects([...projects, p]);
  };

  return (
    <div>
      <h1>Projects page</h1>
      <h3>Create a new project</h3>
      <CreateProjectModal createProjectFunc={createProject} />
      <h3 className="mt-10">Existing projects</h3>
      {projects.map((p, i) => (
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
