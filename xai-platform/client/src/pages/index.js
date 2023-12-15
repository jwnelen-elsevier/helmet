import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import TextHighlighter from "@/components/TextHighlighter";

const inter = Inter({ subsets: ["latin"] });

const serverUrl = process.env.SERVER_URL ?? "http://localhost:3000";

const defaultData = {
  text: "This is a test, you can at least see how it would look like",
  fAttribution: [0, 1, 0, 0.5, 0, 0, 0.1, 0, 0.8, 0, 0, 0, 0, 0, 0.6, 0],
};

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
  if (!data || Object.keys(data).length === 0) {
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
          const { text, fAttribution, metaData } = d;
          return (
            <TextHighlighter
              text={text}
              fAttribution={fAttribution}
              metaData={metaData}
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
