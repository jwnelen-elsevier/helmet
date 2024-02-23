"use client";
import { createContext, useState } from "react";

export const SelectedProjectContext = createContext(null);

// export const useSelectedProject = () => useContext(SelectedProjectContext);

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState();

  // useEffect(() => {
  //   fetchProjects().then((projects) => {
  //     setProjects(projects);
  //   });
  // }, []);

  return (
    <SelectedProjectContext.Provider
      value={{ selectedProject, setSelectedProject }}
    >
      {children}
    </SelectedProjectContext.Provider>
  );
};
