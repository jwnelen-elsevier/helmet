"use client";
import Link from "next/link";
import { useState } from "react";

import { Button, Tooltip } from "@nextui-org/react";
import AlternativesDisplayer from "app/_components/run/AlternativesDisplayer";
import TextHighlighter from "app/_components/run/textHighlighter";
import CopyableText from "app/_components/ui/copyableText";
import { QuestionIcon } from "app/_components/ui/icons";

const DetailDisplayer = ({ props }) => {
  const {
    output,
    groundtruth,
    input,
    explanation,
    _id,
    output_alternatives,
    model_checkpoint,
    execution_time_in_sec,
  } = props;

  const [showAttributions, s] = useState(false);
  const [hoveredTokenIndex, setHoveredToken] = useState(null);

  const setHoveredIndex = (index) => {
    setHoveredToken(index);
  };

  const hasExplanation = explanation !== null;

  const expanationDetailsHighlights = () => {
    if (!hasExplanation) {
      return <p className="italic">No explanations available</p>;
    }
    const { input_attribution, explanation_method } = explanation;
    const { input_tokens } = input;
    const { tokens: output_tokens } = output;

    const inputLength = input_tokens.length || 0;
    const hoverOverOutput = hoveredTokenIndex >= inputLength;

    const attributions = hoverOverOutput
      ? input_attribution[hoveredTokenIndex - inputLength]
      : null;

    return (
      <div>
        <div className="flex flex-row space-y-2 py-2">
          <div>
            <TextHighlighter
              tokens={input_tokens.concat(output_tokens)}
              attributions={attributions}
              setHoveredIndex={setHoveredIndex}
              showAttributions={showAttributions}
            ></TextHighlighter>
          </div>
        </div>
        <span className="flex gap-2 items-center">
          <>
            {`Attribution method: ${explanation_method}`}
            <Tooltip
              showArrow={true}
              content={"Info about explainability methods"}
            >
              <Link href={"/resources#gradientxinput"}>
                <QuestionIcon />
              </Link>
            </Tooltip>
          </>
        </span>
      </div>
    );
  };

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
      <div className="border rounded p-5 max-w-full">
        <p>Alternatives</p>
        <div className="flex flex-row space-x-4 max-w-full overflow-x-scroll">
          {output_alternatives.map((alternative, index) => (
            <AlternativesDisplayer
              key={index}
              output_alternatives={alternative}
            ></AlternativesDisplayer>
          ))}
        </div>
      </div>
      {/* Watch out that we should display groundtruth if the output is 0 */}
      {groundtruth !== null ||
        ("" && <p className="px-2">Ground truth: {groundtruth}</p>)}
      <div className="border rounded p-5">{expanationDetailsHighlights()}</div>
      {hasExplanation && (
        <div className="flex flex-row gap-2">
          <Button
            onClick={() => s(!showAttributions)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showAttributions ? "Hide attributions" : "Show attributions"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DetailDisplayer;
