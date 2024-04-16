import { Tooltip } from "@nextui-org/react";
import AlternativesDisplayer from "app/_components/explanations/alternativesDisplayer";
import ContrastiveExplainer from "app/_components/explanations/contrastive";
import FeatureImportance from "app/_components/explanations/featureImportance";
import { InfoIcon } from "app/_components/ui/icons";
import Link from "next/link";

const ExplanationTitle = ({ explanationMethod }) => {
  return (
    <h3 className="inline-flex gap-2 text-xl items-center bold">
      {explanationMethod}{" "}
      <Tooltip showArrow={true} content={"Info about explainability methods"}>
        <Link href={"/resources#gradientxinput"}>
          <InfoIcon />
        </Link>
      </Tooltip>{" "}
    </h3>
  );
};

const tokenWiseFeatureImportance = (explanation, input, output) => {
  return (
    <>
      <ExplanationTitle explanationMethod="Feature Attribution" />
      <FeatureImportance
        explanation={explanation}
        input={input}
        output={output}
      />
    </>
  );
};

const alternativesRenderer = (output_alternatives) => (
  <>
    <ExplanationTitle explanationMethod="Alternatives Tokens" />
    <AlternativesDisplayer output_alternatives={output_alternatives} />
  </>
);

const contrastiveRenderer = (explanation, input, output) => {
  return (
    <>
      <ExplanationTitle explanationMethod="Contrastive explainer " />
      <ContrastiveExplainer
        explanation={explanation}
        input={input}
        output={output}
      />
    </>
  );
};

const ExplainerRenderer = (explanation, input, output) => {
  const { explanation_method } = explanation;
  // TODO: Refactor this
  switch (explanation_method) {
    case "contrastive":
      return contrastiveRenderer(explanation, input, output);
    case "saliency":
      return tokenWiseFeatureImportance(explanation, input, output);
    case "alternatives":
      const output_alternatives = explanation.output_alternatives;
      return alternativesRenderer(output_alternatives);
    default:
      return (
        <p className="text-red-500">
          Explanation method {explanation_method} not found
        </p>
      );
  }
};

export default ExplainerRenderer;
