import DisplayProjects from "@/app/_components/project/projects";

export default async function Page() {
  return (
    <div className="container text-center mx-auto">
      <h1>Welcom to the XAI Platform of LLMEX</h1>
      <DisplayProjects />
    </div>
  );
}
