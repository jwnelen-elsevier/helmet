"use client";
import { useState } from "react";
import TextHighlighter from "@/app/_components/textHighlighter";
import { QuestionIcon } from "@/app/_components/ui/icons";

const DetailDisplayer = ({ props }) => {
  const { date, output, input, explanation, input_tokens, _id } = props;
  const { input_attribution, explanation_method } = explanation;
  const [showAttributions, s] = useState(false);

  return (
    <div className="flex flex-row py-2">
      <TextHighlighter
        tokens={input_tokens}
        attributions={input_attribution}
        showAttributions={showAttributions}
      />
      <p className="px-2">Classified: {output}</p>
      <p>
        {`Attribution method: ${explanation_method}`} <QuestionIcon />
      </p>
    </div>
  );
};

export default DetailDisplayer;
