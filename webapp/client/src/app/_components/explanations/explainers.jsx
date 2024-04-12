import { Tooltip } from "@nextui-org/react";
import AlternativesDisplayer from "app/_components/explanations/alternativesDisplayer";
import ContrastiveExplainer from "app/_components/explanations/contrastive";
import FeatureImportance from "app/_components/explanations/featureImportance";
import { QuestionIcon } from "app/_components/ui/icons";
import Link from "next/link";

const ExplanationTitle = ({ explanationMethod }) => {
  return (
    <h3 className="inline-flex gap-2 text-xl items-center bold">
      {explanationMethod}{" "}
      <Tooltip showArrow={true} content={"Info about explainability methods"}>
        <Link href={"/resources#gradientxinput"}>
          <QuestionIcon />
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
    <ExplanationTitle explanationMethod="Alternatives" />
    <div className="flex flex-row space-x-4 max-w-full overflow-x-scroll">
      {output_alternatives?.map((alternative, index) => (
        <AlternativesDisplayer
          key={index}
          output_alternatives={alternative}
        ></AlternativesDisplayer>
      ))}
    </div>
  </>
);

const contrastiveRenderer = (explanation) => {
  return (
    <>
      <ExplanationTitle explanationMethod="Alternatives" />
      <ContrastiveExplainer explanation={explanation} />
    </>
  );
};

const ExplainerRenderer = (explanation, input, output) => {
  const { explanation_method } = explanation;
  switch (explanation_method) {
    case "contrastive":
      return contrastiveRenderer(explanation);
    case "gradient":
      return tokenWiseFeatureImportance(explanation, input, output);
    case "alternatives":
      const output_alternatives = explanation.alternatives;
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
