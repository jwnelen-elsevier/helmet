"use client";

import ExplainerRenderer from "app/_components/explanations/explainers";
import Legenda from "app/_components/explanations/legenda";
import CopyableText from "app/_components/ui/copyableText";
import { options } from "utils/constants";
import { maxDecimals } from "utils/strings";
import SuggestionRenderer from "../explanations/suggestions";

const DetailDisplayer = ({ props }) => {
  const {
    output,
    input,
    explanations,
    _id,
    model_checkpoint,
    execution_time_in_sec,
    groundtruth = "not provided",
  } = props;

  const explanationNames = new Set(
    explanations.map((explanation) => explanation.explanation_method)
  );
  let optionsLeft = [...options.filter((x) => !explanationNames.has(x))];
  return (
    <div className="flex flex-col space-y-2 items-center px-2 m-4 mb-8">
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
      <p className="border rounded p-5 font-bold">
        Groundtruth: <span className="font-normal">{groundtruth}</span>
      </p>
      <div className="max-w-full flex flex-col gap-y-2">
        <h2>Calculated Explanations</h2>
        {explanations?.map((explanation, index) => (
          <div key={index} className="border rounded p-5">
            {ExplainerRenderer(explanation, input, output)}
          </div>
        ))}
      </div>
      <Legenda />
      {optionsLeft.length > 0 && (
        <div className="max-w-full flex flex-col gap-y-2">
          <h2>Suggested Explanations</h2>
          {optionsLeft.map((explanationName, index) => (
            <div key={`${index}-expl`} className="border rounded p-5">
              {SuggestionRenderer(explanationName, _id)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailDisplayer;
