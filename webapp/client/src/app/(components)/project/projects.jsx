"use client";
import React, { useState } from "react";
import CreateProjectModal from "@/app/(components)/setup_modal";

const DisplayProjects = ({ projectsIn }) => {
  const [projects, setProjects] = useState(projectsIn);

  const createProject = async (p) => {
    // createProject server side
    // const newProject = await createProject(p);
    setProjects([...projects, p]);
  };

  return (
    <div>
      <h1>Projects</h1>
      <CreateProjectModal createProjectFunc={createProject} />
      {projects.map((p, i) => (
        <p key={i}>{p.projectName}</p>
      ))}
    </div>
  );
};

export default DisplayProjects;
