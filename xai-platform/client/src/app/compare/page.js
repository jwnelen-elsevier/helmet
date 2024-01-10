// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
export default function Page() {
  return <h1>Hello, Dashboard Page!</h1>;
}

// const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

// import { useState } from "react";
// import defaultData from "../../data/defaultValues.js";
// import TextHighlighter from "@/components/TextHighlighter";

// export async function getStaticProps() {
//   console.log("Getting static props from", serverUrl);
//   let res;
//   try {
//     res = await fetch(`${serverUrl}/compare`);
//   } catch (e) {
//     console.log("Error fetching explainer at ", serverUrl);
//     console.log(e);
//     return {
//       props: {
//         data: {
//           error: "Error fetching explainer",
//           defaultData: defaultData,
//         },
//       },
//     };
//   }

//   if (!res?.ok) {
//     console.log("Error fetching explainer at ", serverUrl);
//     console.log(res);
//     return {
//       props: {
//         data: {
//           error: "Error fetching explainer",
//           ...defaultData,
//         },
//       },
//     };
//   }
//   const data = await res.json();

//   return {
//     props: { data },
//   };
// }

// function ExplainerDisplay({ data }) {
//   console.log(data);
//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   if (data.length === 0) {
//     return <div>No data yet</div>;
//   }

//   if (data.error) {
//     data = data.defaultData;
//   }

//   return (
//     <table className="table-auto w-full">
//       <thead className="border-b">
//         <tr>
//           <th>Feature Attributions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((d, i) => {
//           const { tokens, attributions } = d;
//           return (
//             <TextHighlighter
//               text={tokens}
//               fAttribution={attributions}
//               key={i}
//             ></TextHighlighter>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// }

// export default function Compare({ data }) {
//   const [showAttributions, setShowAttributions] = useState(false);

//   return (
//     <main
//       className={`flex min-h-screen min-w-screen flex-col items-center py-24`}
//     >
//       <h1 className="text-xl mb-4">Compare</h1>
//       <label>
//         <input
//           value={showAttributions}
//           type="checkbox"
//           onChange={(e) => setShowAttributions(!showAttributions)}
//         ></input>
//         <span className="p-1">Show Attributions</span>
//       </label>
//       <div className="grid grid-cols-2 divide-x">
//         <TextHighlighter
//           className="p-16"
//           showAttributions={showAttributions}
//           text={data[0].tokens}
//           fAttribution={data[0].attributions}
//         ></TextHighlighter>
//         <TextHighlighter
//           className="p-16"
//           text={data[0].tokens2}
//           showAttributions={showAttributions}
//           fAttribution={data[0].attributions2}
//         ></TextHighlighter>
//       </div>
//     </main>
//   );
// }
