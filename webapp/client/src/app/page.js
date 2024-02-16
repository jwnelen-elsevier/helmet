import Link from "next/link";

export default async function Page() {
  return (
    <div className="container text-center mx-auto">
      <h1>Welcom to the XAI Platform of LLMEX</h1>
      <p>
        Go to the{" "}
        <Link href={"/runs"} className="italic">
          All runs
        </Link>{" "}
        page
      </p>
      <p>
        You can find more information about this app at{" "}
        <Link href={"/resources"}></Link>
      </p>
    </div>
  );
}
