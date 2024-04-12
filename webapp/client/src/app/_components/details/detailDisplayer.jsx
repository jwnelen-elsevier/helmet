"use client";
import { useState } from "react";

import { Tooltip } from "@nextui-org/react";
import AlternativesDisplayer from "app/_components/explanations/alternativesDisplayer";
import ContrastiveExplainer from "app/_components/explanations/contrastive";
import CopyableText from "app/_components/ui/copyableText";
import { QuestionIcon } from "app/_components/ui/icons";
import Link from "next/link";

const explainerRenderer = (explanation) => {
  const { explanation_method } = explanation;
  switch (explanation_method) {
    case "contrastive":
      return <ContrastiveExplainer explanation={explanation} />;
    // case "gradient":
    //   return <TextHighlighter explanation={explanation} />;
    case "alternatives":
      const output_alternatives = explanation.alternatives;
      return (
        <>
          <p className="inline-flex gap-2 text-xl items-center bold">
            Alternatives{" "}
            <Tooltip
              showArrow={true}
              content={"Info about explainability methods"}
            >
              <Link href={"/resources#gradientxinput"}>
                <QuestionIcon />
              </Link>
            </Tooltip>{" "}
          </p>
          <></>
          <div className="flex flex-row space-x-4 max-w-full overflow-x-scroll">
            {output_alternatives?.map((alternative, index) => (
              <AlternativesDisplayer
                key={index}
                output_alternatives={alternative}
              ></AlternativesDisplayer>
            ))}
          </div>
        </>
      );
    default:
      return (
        <p className="text-red-500">
          Explanation method {explanation_method} not found
        </p>
      );
  }
};

// const expanationDetailsHighlights = () => {
//   if (!hasExplanation) {
//     return <p className="italic">No explanations available</p>;
//   }
//   const { input_attribution, explanation_method } = explanation;
//   const { input_tokens } = input;
//   const { tokens: output_tokens } = output;

//   const inputLength = input_tokens.length || 0;
//   const hoverOverOutput = hoveredTokenIndex >= inputLength;
//   const multiDimensionalExplanation = explanation_method !== "contrastive";
//   let attributions = input_attribution;
//   if (multiDimensionalExplanation) {
//     attributions = hoverOverOutput
//       ? input_attribution[hoveredTokenIndex - inputLength]
//       : null;
//   }

//   return (
//     <div>
//       <div className="flex flex-row space-y-2 py-2">
//         <div>
//           {explanation_method === "contrastive" && (
//             <p className="font-bold">{explanation.contrastive_input}</p>
//           )}
//           {/* <TextHighlighter
//             tokens={input_tokens.concat(output_tokens)}
//             attributions={attributions}
//             hoveredIndex={hoveredTokenIndex}
//             setHoveredIndex={setHoveredIndex}
//             showAttributions={showAttributions}
//           ></TextHighlighter> */}
//         </div>
//       </div>
//       <span className="flex gap-2 items-center">
//         <>
//           {`Attribution method: ${explanation_method}`}
//           <Tooltip
//             showArrow={true}
//             content={"Info about explainability methods"}
//           >
//             <Link href={"/resources#gradientxinput"}>
//               <QuestionIcon />
//             </Link>
//           </Tooltip>
//         </>
//       </span>
//     </div>
//   );
// };

const DetailDisplayer = ({ props }) => {
  const {
    output,
    input,
    explanations,
    _id,
    model_checkpoint,
    execution_time_in_sec,
  } = props;

  const [showAttributions, s] = useState(false);
  // const [hoveredTokenIndex, setHoveredToken] = useState(null);

  // const setHoveredIndex = (index) => {
  //   setHoveredToken(index);
  // };

  // const hasExplanation = explanation !== null;

  return (
    <div className="flex flex-col space-y-2 items-center">
      <div className="border rounded p-5">
        <p>
          <span className="font-bold">Model: </span>
          {model_checkpoint}
        </p>
        <p>
          <span className="font-bold">Run id: </span>
          <CopyableText text={_id} />{" "}
        </p>
        <p>
          <span className="font-bold">Execution time: </span>
          {execution_time_in_sec} sec
        </p>
      </div>
      <p className="border rounded p-5 font-bold">
        Input: <span className="font-normal">{input.prompt}</span>
      </p>
      <p className="border rounded p-5 font-bold">
        Output: <span className="font-normal">{output.output_str}</span>
      </p>
      <div className="max-w-full">
        <h3>Explanations</h3>
        {explanations?.map((explanation, index) => (
          <div key={index} className="border rounded p-5">
            {explainerRenderer(explanation)}
          </div>
        ))}
      </div>
      {/* <div className="border rounded p-5">{expanationDetailsHighlights()}</div> */}
      {/* {hasExplanation && (
        <div className="flex flex-row gap-2">
          <Button
            onClick={() => s(!showAttributions)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showAttributions ? "Hide attributions" : "Show attributions"}
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default DetailDisplayer;
