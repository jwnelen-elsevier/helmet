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
  if (!data || data?.length === 0) {
    return <div>Loading...</div>;
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

  return (
    <TextHighlighter text={text} fAttribution={fAttribution}></TextHighlighter>
  );
}

export default function Home({ data }) {
  return (
    <main
      className={`flex min-h-screen min-w-screen flex-col items-center justify-between py-24 ${inter.className}`}
    >
      {data && <ExplainerDisplay data={data}></ExplainerDisplay>}
    </main>
  );
}
