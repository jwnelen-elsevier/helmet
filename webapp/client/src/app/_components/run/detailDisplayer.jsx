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
    input_tokens,
    _id,
    output_alternatives,
    model_checkpoint,
  } = props;

  const [showAttributions, s] = useState(false);

  const expanationDetailsHighlights = () => {
    if (explanation === null) {
      return (
        <div>
          <p className="italic">No explanation provided</p>
          <div className="flex flex-row py-2 ">
            <p>{input.prompt}</p>
          </div>
        </div>
      );
    }
    const { input_attribution, explanation_method } = explanation;

    return (
      <div>
        <div className="flex flex-row space-y-2 py-2">
          <TextHighlighter
            tokens={input_tokens}
            attributions={input_attribution}
            showAttributions={showAttributions}
          ></TextHighlighter>
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
        <p className="font-bold">Model: {model_checkpoint}</p>
        <p className="font-bold">
          <span>ID: </span>
          <CopyableText text={_id} />{" "}
        </p>
      </div>
      <div className="border rounded p-5">
        <p className="font-bold">
          Input: <span className="font-normal">{input.prompt}</span>
        </p>
        <p className="font-bold">
          Output: <span className="font-normal">{output}</span>
        </p>
      </div>
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
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => s(!showAttributions)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showAttributions ? "Hide attributions" : "Show attributions"}
        </Button>
      </div>
    </div>
  );
};

export default DetailDisplayer;
