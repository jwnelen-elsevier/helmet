"use server";

const url = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const fetchStatus = async () => {
  try {
    const response = await fetch(`${url}/status`, {
      method: "GET",
      cache: "no-store",
    });
    return response.ok;
  } catch (error) {
    console.log(error);
  }
  return false;
};
