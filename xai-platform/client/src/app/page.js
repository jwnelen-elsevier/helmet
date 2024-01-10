import ModelCard from "@/components/ModelCard";
import TextHighlighter from "@/components/TextHighlighter";

export const metadata = {
  title: "XAI Platform",
};

const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

async function fetchExplainerData() {
  const res = await fetch(`${serverUrl}/explainer`, {
    cache: "no-cache",
  });
  if (!res?.ok) {
    throw new Error("Error fetching explainer");
  }

  return res.json();
}

export default async function Page() {
  const data = await fetchExplainerData();
  console.log("got data", data);
  const f = data.data[0];

  console.log("f", f);
  return (
    <div>
      <ModelCard model={data.model}></ModelCard>
      <TextHighlighter
        tokens={f.tokens}
        attributions={f.attributions}
      ></TextHighlighter>
    </div>
  );
}

// TODO: Add revalidatePath when we delete all state.
