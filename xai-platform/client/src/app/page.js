import ModelCard from "@/components/ModelCard";

export const metadata = {
  title: "XAI Platform",
};

const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

async function fetchExplainerData() {
  const res = await fetch(`${serverUrl}/explainer`);
  if (!res?.ok) {
    throw new Error("Error fetching explainer");
  }

  return res.json();
}

export default async function Page() {
  const data = await fetchExplainerData();

  console.log(data);
  return (
    <div>
      <ModelCard model={data.model}></ModelCard>
    </div>
  );
}

// TODO: Add revalidatePath when we delete all state.
