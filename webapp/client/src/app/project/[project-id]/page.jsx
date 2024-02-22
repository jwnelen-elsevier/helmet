export default function Page({ params }) {
  return (
    <div>
      <h1>Project {params["project-id"]}</h1>
    </div>
  );
}
