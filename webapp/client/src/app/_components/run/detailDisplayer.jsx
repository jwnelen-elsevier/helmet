"use client";
import Link from "next/link";
import { useState } from "react";

import { Button, Tooltip } from "@nextui-org/react";
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
        <div className="flex flex-row py-2 ">
          <TextHighlighter
            tokens={input_tokens}
            attributions={input_attribution}
            showAttributions={showAttributions}
          ></TextHighlighter>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <p className="font-bold">Model: {model_checkpoint}</p>
      <p className="font-bold">
        <span>ID: </span>
        <CopyableText text={_id} />{" "}
      </p>
      <p className="px-2">
        <span className="font-bold">Output: </span>
        {output}
      </p>
      {/* Watch out that we should display groundtruth if the output is 0 */}
      {groundtruth !== null ||
        ("" && <p className="px-2">Ground truth: {groundtruth}</p>)}
      {expanationDetailsHighlights()}
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
