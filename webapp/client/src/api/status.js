"use server";

const url = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

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

export const fetchModel = async () => {
  try {
    const response = await fetch(`${url}/model`, {
      method: "GET",
      cache: "no-store",
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
};
