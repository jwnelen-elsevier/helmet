"use client";

import ExplainerRenderer from "app/_components/explanations/explainers";
import CopyableText from "app/_components/ui/copyableText";

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
      <div className="max-w-full flex flex-col gap-y-2">
        <h2>Explanations</h2>
        {explanations?.map((explanation, index) => (
          <div key={index} className="border rounded p-5">
            {ExplainerRenderer(explanation, input, output)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailDisplayer;
