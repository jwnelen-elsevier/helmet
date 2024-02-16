"use client";
import { useState } from "react";
import Link from "next/link";

import TextHighlighter from "@/app/_components/textHighlighter";
import { QuestionIcon } from "@/app/_components/ui/icons";
import { CopyIcon, CopySucceedIcon } from "./ui/icons";
import clsx from "clsx";

const DetailDisplayer = ({ props }) => {
  const {
    date,
    output,
    groundtruth,
    input,
    explanation,
    input_tokens,
    _id,
    model_checkpoint,
  } = props;
  const { input_attribution, explanation_method } = explanation;
  const [showAttributions, s] = useState(false);

  const [isCopied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold">Model: {model_checkpoint}</h2>
      <p className="px-2">Classified: {output}</p>
      {groundtruth !== null && (
        <p className="px-2">Ground truth: {groundtruth}</p>
      )}
      <span className="flex gap-2 items-center">
        {`Attribution method: ${explanation_method}`}
        <Link href={"/resources#gradientxinput"}>
          <QuestionIcon />
        </Link>
      </span>
      <div className="flex flex-row py-2 ">
        <TextHighlighter
          tokens={input_tokens}
          attributions={input_attribution}
          showAttributions={showAttributions}
        />
      </div>
      <div className="flex flex-row gap-2">
        <button
          onClick={() => s(!showAttributions)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Show attributions
        </button>
      </div>
      <div className="flex flex-row items-center group">
        {_id}
        <button
          onClick={() => copyToClipboard(_id)}
          className={clsx(
            " cursor-pointer text-black",
            isCopied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isCopied ? <CopySucceedIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};

export default DetailDisplayer;
