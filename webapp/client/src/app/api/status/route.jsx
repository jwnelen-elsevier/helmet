import { NextResponse, revalidatePath } from "next/server";
const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(request) {
  console.log("GET /api/status invoked");
  const res = await fetch(`${url}/status`, {
    cache: "no-store",
  });
  const data = await res.json();

  console.log(data);

  const path = request.nextUrl.searchParams.get("path");
  revalidatePath("/status");
  console.log(`Revalidated path: ${path}`);

  // if (path) {
  //   console.log(`Revalidated path: ${path}`);
  //   revalidatePath(path);
  // }
  return NextResponse.json(data);
}

// export const fetchStatus = async () => {
//   try {
//     const response = await fetch(`${url}/status`, {
//       method: "GET",
//       // cache: "no-store", Does not work
//       // next: {revalidate: 1}, Does not work
//     });
//     return response.ok;
//   } catch (error) {
//     console.log(error);
//   }
//   return false;
// };

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
