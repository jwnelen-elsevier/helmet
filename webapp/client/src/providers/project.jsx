"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { fetchProjects, createProject } from "@/api/projects";

export const SelectedProjectContext = createContext(null);

export const useSelectedProject = () => useContext(SelectedProjectContext);

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then((projects) => {
      setProjects(projects);
    });
  }, []);

  const createNewProject = async (newP) => {
    // create a new project
    createProject(newP).then((createdProject) => {
      if (!createdProject) return;
      if (createdProject.acknowledged === false) return;
      newP["_id"] = createdProject.insertedId;
      setProjects([...projects, newP]);
      return newP;
    });
  };

  return (
    <SelectedProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        createNewProject,
      }}
    >
      {children}
    </SelectedProjectContext.Provider>
  );
};
