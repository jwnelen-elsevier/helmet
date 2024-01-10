import ModelCard from "@/components/ModelCard";
import TextHighlighter from "@/components/TextHighlighter";

export const metadata = {
  title: "XAI Platform",
};

const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

async function fetchExplainerData() {
  try {
    const res = await fetch(`${serverUrl}/explainer`, {
      cache: "no-cache",
    });
    return await res.json();
  } catch (e) {
    console.log("error fetching explainer", e);
    return {};
  }
}

export default async function Page() {
  const data = await fetchExplainerData();
  const explanations = data?.data;

  if (!explanations) {
    return (
      <div className="w-full h-full text-center m-auto">
        Could not load data
      </div>
    );
  }

  return (
    <div>
      <ModelCard model={data.model}></ModelCard>
      {explanations.map((f) => (
        <TextHighlighter
          tokens={f.tokens}
          attributions={f.attributions}
        ></TextHighlighter>
      ))}
    </div>
  );
}

// TODO: Add revalidatePath when we delete all state.