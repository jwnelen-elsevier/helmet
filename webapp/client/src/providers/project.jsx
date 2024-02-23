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
    createProject(newP).then((createdProject) => {
      if (!createdProject) return;
      if (createdProject.acknowledged === false) return;
      newP["_id"] = createdProject.insertedId;
      setProjects([...projects, newP]);
    });
  };

  return (
    <SelectedProjectContext.Provider
      value={{
        projects,
        selectedProject,
        selectProject,
        createNewProject,
      }}
    >
      {children}
    </SelectedProjectContext.Provider>
  );
};
