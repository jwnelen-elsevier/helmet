import TextHighlighter from "app/_components/explanations/textHighlighter";
import { useState } from "react";
import { removeSpecialChars } from "utils/strings";

const FeatureImportance = ({ explanation, input, output }) => {
  const { input_attributions } = explanation;
  const { input_tokens } = input;
  const inputLength = input_tokens.length || 0;
  const { tokens: output_tokens } = output;

  const [hoveredTokenIndex, setHoveredToken] = useState(inputLength);

  const hoverOverOutput = hoveredTokenIndex >= inputLength;

  const attributions = hoverOverOutput
    ? input_attributions[hoveredTokenIndex - inputLength]
    : null;

  const highlightedToken = hoverOverOutput
    ? removeSpecialChars(output_tokens[hoveredTokenIndex - inputLength])
    : "";

  const HoveredQuestion = () => {
    if (!hoverOverOutput) {
      return <p className="text-sm italic">Hovering over a input token</p>;
    }
    return (
      <p className="text-sm">
        Why did the model predict{" "}
        <span className="italic">{highlightedToken}&quot;</span>?
      </p>
    );
  };

  return (
    <div>
      <HoveredQuestion />
      <TextHighlighter
        tokens={input_tokens.concat(output_tokens)}
        attributions={attributions}
        hoveredIndex={hoveredTokenIndex}
        setHoveredIndex={(index) => setHoveredToken(index)}
      ></TextHighlighter>
    </div>
  );
};

export default FeatureImportance;
