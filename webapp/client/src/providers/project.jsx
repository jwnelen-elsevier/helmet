"use client";
import { createProject, fetchProjects } from "@/app/actions/actions";
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
      const projectDetails = projects.find(
        (p) => `${p._id}` === `${projectId}`
      );
      if (!projectDetails) {
        localStorage.removeItem("projectId");
      }
      setSelectedProject(projectDetails);
    }
  }, [projects]);

  const selectProject = async (project) => {
    localStorage.setItem("projectId", project._id);
    setSelectedProject(project);
  };

  const createNewProject = async (newP) => {
    const createdProject = await createProject(newP);
    if (!createdProject) return null;
    setProjects([...projects, createdProject]);
    return createdProject;
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
