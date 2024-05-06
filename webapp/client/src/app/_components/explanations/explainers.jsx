import { Tooltip } from "@nextui-org/react";
import AlternativesDisplayer from "app/_components/explanations/alternativesDisplayer";
import CertaintyExplainer from "app/_components/explanations/certainty";
import ContrastiveExplainer from "app/_components/explanations/contrastive";
import FeatureImportance from "app/_components/explanations/featureImportance";
import { InfoIcon } from "app/_components/ui/icons";
import Link from "next/link";
import {
  ALTERNATIVES,
  CERTAINTY,
  CONTRASTIVE,
  FEATURE_ATTRIBUTION,
} from "utils/constants";

const ExplanationTitle = ({ explanationName }) => {
  return (
    <h3 className="inline-flex gap-2 text-xl items-center">
      {explanationName}{" "}
      <Tooltip showArrow={true} content={"Info about this method"}>
        <Link href={"/resources#gradientxinput"}>
          <InfoIcon />
        </Link>
      </Tooltip>{" "}
    </h3>
  );
};

const AlternativesRenderer = (output_alternatives) => {
  const explanationName = "Alternatives Tokens";
  return (
    <div>
      <ExplanationTitle explanationName={explanationName} />
      <AlternativesDisplayer output_alternatives={output_alternatives} />
    </div>
  );
};

const ContrastiveRenderer = (explanation, input, output) => {
  const explanationName = "Contrastive Explainer";

  return (
    <div>
      <ExplanationTitle explanationName={explanationName} />
      <ContrastiveExplainer
        explanation={explanation}
        input={input}
        output={output}
      />
    </div>
  );
};

const CertaintyRenderer = (explanation, output) => {
  const explanationName = "Certainty";

  return (
    <div>
      <ExplanationTitle explanationName={explanationName} />
      <CertaintyExplainer
        certainties={explanation.certainties}
        output={output.tokens}
      ></CertaintyExplainer>
    </div>
  );
};

const FeatureImportanceRenderer = (explanation, input, output) => {
  const explanationName = "Token Level Feature Importance";
  return (
    <div>
      <ExplanationTitle explanationName={explanationName} />
      <FeatureImportance
        explanation={explanation}
        input={input}
        output={output}
      />
    </div>
  );
};

const ExplainerRenderer = (explanation, input, output) => {
  switch (explanation?.explanation_method) {
    case CONTRASTIVE:
      return ContrastiveRenderer(explanation, input, output);
    case FEATURE_ATTRIBUTION:
      return FeatureImportanceRenderer(explanation, input, output);
    case ALTERNATIVES:
      return AlternativesRenderer(explanation.output_alternatives);
    case CERTAINTY:
      return CertaintyRenderer(explanation, output);
    default:
      return <div>Unknown explainer</div>;
  }
};

export default ExplainerRenderer;
