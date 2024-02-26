"use server";
import { revalidatePath } from "next/server";

export default async function revalidate() {
  revalidatePath("/");
  return { status: "revalidated" };
}
