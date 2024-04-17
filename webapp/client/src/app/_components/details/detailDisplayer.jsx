"use client";

import ExplainerRenderer from "app/_components/explanations/explainers";
import CopyableText from "app/_components/ui/copyableText";
import { options } from "utils/constants";
import { maxDecimals } from "utils/strings";

const DetailDisplayer = ({ props }) => {
  const {
    output,
    input,
    explanations,
    _id,
    model_checkpoint,
    execution_time_in_sec,
  } = props;

  return (
    <div className="flex flex-col space-y-2 items-center px-2">
      <div className="border rounded p-5">
        <p>
          <span className="font-bold">Model: </span>
          <span className="font-mono">{model_checkpoint}</span>
        </p>
        <p>
          <span className="font-bold">Run id: </span>
          <span className="font-mono">
            <CopyableText text={_id} />{" "}
          </span>
        </p>
        <p>
          <span className="font-bold">Execution time: </span>
          {maxDecimals(execution_time_in_sec, 3)} sec
        </p>
      </div>
      <p className="border rounded p-5 font-bold">
        Input: <span className="font-normal">{input.prompt}</span>
      </p>
      <p className="border rounded p-5 font-bold">
        Output: <span className="font-normal">{output.output_str}</span>
      </p>
      <div className="max-w-full flex flex-col gap-y-2">
        <h2>Explanations</h2>
        {options?.map((explanationName, index) => (
          <div key={index} className="border rounded p-5">
            {ExplainerRenderer(
              explanationName,
              explanations,
              input,
              output,
              _id
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailDisplayer;
