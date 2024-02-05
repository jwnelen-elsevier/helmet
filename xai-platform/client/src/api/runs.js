"use server";

const url = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

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
  return [];
};
