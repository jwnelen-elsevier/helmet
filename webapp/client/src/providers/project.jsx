"use client";
import { createProject, fetchProjects } from "@/api/projects";
import { createContext, useContext, useEffect, useState } from "react";

export const ProjectsContext = createContext(null);

export const useSelectedProject = () => useContext(ProjectsContext);

export const ProjectsProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then((projects) => {
      setProjects(projects);
    });
  }, []);

  useEffect(() => {
    const projectId = localStorage.getItem("projectId");

    if (projectId && projects.length > 0) {
      console.log("Project ID found in local storage", projectId, projects);
      const projectDetails = projects.find(
        (p) => `${p._id}` === `${projectId}`
      );
      console.log(projectDetails);
      if (!projectDetails) {
        localStorage.removeItem("projectId");
      }
      setSelectedProject(projectDetails);
    }
  }, [projects]);

  const selectProject = (project) => {
    console.log("selecting project", project);
    localStorage.setItem("projectId", project._id);
    const projectDetails = projects.find(
      (p) => `${p._id}` === `${project._id}`
    );
    if (!projectDetails) {
      localStorage.removeItem("projectId");
    }
    setSelectedProject(projectDetails);
  };

  const createNewProject = async (newP) => {
    // create a new project
    const createdProject = await createProject(newP);
    if (!createdProject) return null;
    if (createdProject.acknowledged === false) return null;
    newP["_id"] = createdProject.insertedId;
    setProjects([...projects, newP]);
    return createdProject.acknowledged;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        selectedProject,
        selectProject,
        createNewProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
