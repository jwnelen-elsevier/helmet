import TextHighlighter from "app/_components/explanations/textHighlighter";
import { useState } from "react";

const FeatureImportance = ({ explanation, input, output }) => {
  const { input_attribution } = explanation;
  const { input_tokens } = input;
  const inputLength = input_tokens.length || 0;
  const { tokens: output_tokens } = output;

  const [hoveredTokenIndex, setHoveredToken] = useState(inputLength);

  const hoverOverOutput = hoveredTokenIndex >= inputLength;

  const attributions = hoverOverOutput
    ? input_attribution[hoveredTokenIndex - inputLength]
    : null;

  return (
    <TextHighlighter
      tokens={input_tokens.concat(output_tokens)}
      attributions={attributions}
      hoveredIndex={hoveredTokenIndex}
      setHoveredIndex={(index) => setHoveredToken(index)}
    ></TextHighlighter>
  );
};

export default FeatureImportance;
