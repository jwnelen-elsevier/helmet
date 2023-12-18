import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import TextHighlighter from "@/components/TextHighlighter";

const inter = Inter({ subsets: ["latin"] });

const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

import { defaultData } from "../data/defaultValues.js";

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
          ...defaultData,
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
          ...defaultData,
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
  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data yet</div>;
  }

  return (
    <table className="table-auto w-full">
      <thead className="border-b">
        <tr>
          <th>Feature Attributions</th>
          <th>Date</th>
          <th>MetaData</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => {
          const { tokens, attributions } = d;
          return (
            <TextHighlighter
              text={tokens}
              fAttribution={attributions}
              key={i}
            ></TextHighlighter>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Home({ data }) {
  return (
    <main
      className={`flex min-h-screen min-w-screen flex-col items-center justify-between py-24 ${inter.className}`}
    >
      <ExplainerDisplay data={data}></ExplainerDisplay>
      <button
        className="bg-blue-600 px-3 py-2 rounded text-white"
        onClick={(e) => {
          e.preventDefault();
          console.log("Resetting state");
          fetch(`${serverUrl}/empty-state`, {
            method: "POST",
          }).then((response) => {
            console.log("State reset");
            console.log(response);
            if (response.status !== 200) {
              console.log("Error resetting state");
              console.log(r);
              return;
            }
            window.location.reload();
          });
        }}
      >
        Reset state
      </button>
    </main>
  );
}
