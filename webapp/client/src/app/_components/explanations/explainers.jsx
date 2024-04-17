import { Tooltip } from "@nextui-org/react";
import AlternativesDisplayer from "app/_components/explanations/alternativesDisplayer";
import ContrastiveExplainer from "app/_components/explanations/contrastive";
import FeatureImportance from "app/_components/explanations/featureImportance";
import { InfoIcon } from "app/_components/ui/icons";
import Link from "next/link";
import { ALTERNATIVES, CONTRASTIVE, SALIENCY } from "utils/constants";
import CodeDisplayer from "../ui/codeDisplayer";

const ExplanationTitle = ({ explanationName }) => {
  return (
    <h3 className="inline-flex gap-2 text-xl items-center bold">
      {explanationName}{" "}
      <Tooltip showArrow={true} content={"Info about this method"}>
        <Link href={"/resources#gradientxinput"}>
          <InfoIcon />
        </Link>
      </Tooltip>{" "}
    </h3>
  );
};

const ExplanationNotFound = ({ explanationName, code }) => {
  return (
    <div>
      <p>Want to compute the {explanationName}? Copy the code and run it</p>
      <CodeDisplayer code={code}></CodeDisplayer>
    </div>
  );
};

const tokenWiseFeatureImportance = (explanation, input, output, id) => {
  const explanationName = "Feature Attribution";
  const code = `model.saliency_explainer("${id}")`;
  return (
    <>
      <ExplanationTitle explanationName={explanationName} />
      {explanation ? (
        <FeatureImportance
          explanation={explanation}
          input={input}
          output={output}
        />
      ) : (
        <ExplanationNotFound
          explanationName={explanationName}
          code={code}
        ></ExplanationNotFound>
      )}
    </>
  );
};

const alternativesRenderer = (output_alternatives, id) => {
  const explanationName = "Alternatives Tokens";
  return (
    <>
      <ExplanationTitle explanationName={explanationName} />
      <AlternativesDisplayer output_alternatives={output_alternatives} />
    </>
  );
};

const contrastiveRenderer = (explanation, input, output, id) => {
  const explanationName = "Contrastive explainer";
  const code = `model.contrastive_explainer("${id}", "<token>")`;

  return (
    <>
      <ExplanationTitle explanationName={explanationName} />
      {explanation ? (
        <ContrastiveExplainer
          explanation={explanation}
          input={input}
          output={output}
        />
      ) : (
        <ExplanationNotFound
          explanationName={explanationName}
          code={code}
        ></ExplanationNotFound>
      )}
    </>
  );
};

const ExplainerRenderer = (
  explanationName,
  explanations,
  input,
  output,
  id
) => {
  const explanation = explanations.filter(
    (expl) => expl.explanation_method === explanationName
  )[0];

  switch (explanationName) {
    case CONTRASTIVE:
      return contrastiveRenderer(explanation, input, output, id);
    case SALIENCY:
      return tokenWiseFeatureImportance(explanation, input, output, id);
    case ALTERNATIVES:
      const output_alternatives = explanation.output_alternatives;
      return alternativesRenderer(output_alternatives, id);
  }
};

export default ExplainerRenderer;
