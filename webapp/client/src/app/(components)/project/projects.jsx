"use client";
import React, { useState } from "react";
import CreateProjectModal from "@/app/(components)/project/projectModal";

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
      <h1>Projects</h1>
      <CreateProjectModal createProjectFunc={createProject} />
      {projects.map((p, i) => (
        <p key={i}>{p?.projectName}</p>
      ))}
    </div>
  );
};

export default DisplayProjects;
