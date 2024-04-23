import TextHighlighter from "app/_components/explanations/textHighlighter";
import { removeSpecialChars } from "utils/strings";

const ContrastiveExplainer = ({ explanation, input, output }) => {
  const { attributions, contrastive_input } = explanation;
  const { input_tokens } = input;
  const { tokens: output_tokens } = output;
  const inputLength = input_tokens.length;
  // Create copy of token list
  const token_list = [...output_tokens];

  // Fix below
  let old_token = output_tokens[0];
  old_token = removeSpecialChars(old_token);
  token_list[0] = contrastive_input;

  return (
    <div>
      <p className="text-sm">
        Why not <span className="italic">{contrastive_input}</span> instead of{" "}
        <span className="italic">{old_token}</span>?
      </p>
      <TextHighlighter
        tokens={input_tokens.concat(token_list)}
        attributions={attributions}
        hoveredIndex={inputLength}
      ></TextHighlighter>
    </div>
  );
};

export default ContrastiveExplainer;
