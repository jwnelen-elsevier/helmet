"use server";

const url = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

export const fetchProjects = async () => {
  try {
    const response = await fetch(`${url}/project`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const createProject = async (project) => {
  try {
    const response = await fetch(`${url}/project`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
    console.log("response", response);
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return null;
};
