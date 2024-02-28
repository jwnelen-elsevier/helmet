"use server";

import { revalidatePath } from "next/cache";

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const fetchRuns = async () => {
  try {
    const response = await fetch(`${url}/runs`, {
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

export const fetchRun = async (id) => {
  try {
    const response = await fetch(`${url}/runs/${id}`, {
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
  return [];
};

export const deleteRun = async (id) => {
  try {
    const response = await fetch(`${url}/runs/${id}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return [];
};

export const deleteAllRuns = async (projectId) => {
  const deleteUrl = projectId
    ? `${url}/runs?projectId=${projectId}`
    : `${url}/runs`;
  try {
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return [];
};

export async function fetchStatus() {
  const res = await fetch(`${url}/status`, { cache: "no-store" });
  console.log("fetchStatus: ", res.ok);
  return res.ok;
}

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

    revalidatePath("/");
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return null;
};
