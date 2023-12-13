import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const serverUrl = process.env.SERVER_URL ?? "http://localhost:3000";

export async function getStaticProps() {
  console.log("Getting static props from", serverUrl);
  let res;
  try {
    res = await fetch(`${serverUrl}/explainer`);
  } catch (e) {
    console.log("Error fetching explainer at ", serverUrl);
    console.log(e);
    return {
      props: {
        data: {
          error: "Error fetching explainer",
        },
      },
    };
  }

  if (!res?.ok) {
    console.log("Error fetching explainer at ", serverUrl);
    console.log(res);
    return {
      props: {
        data: {
          error: "Error fetching explainer",
        },
      },
    };
  }
  const data = await res.json();

  return {
    props: { data },
  };
}

function ExplainerDisplay({ data }) {
  console.log(data);
  if (!data || Object.keys(data).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {Object.keys(data).map((key, idx) => (
          <p key={idx}>
            <span className="font-bold text-xl">{key}: </span>
            <span className="font-mono">{data[key]}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Home({ data }) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {data && <ExplainerDisplay data={data}></ExplainerDisplay>}
    </main>
  );
}
