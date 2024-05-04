import { CONTRASTIVE, FEATURE_ATTRIBUTION } from "utils/constants";
import CodeDisplayer from "../ui/codeDisplayer";

const ExplanationSuggestion = ({ explanationName, subText = "", code }) => {
  return (
    <div>
      <p>Want to compute the {explanationName}? Copy the code and run it</p>
      {subText && <p>{subText}</p>}
      <CodeDisplayer code={code}></CodeDisplayer>
    </div>
  );
};

const FeatureAttrSuggestion = ({ id }) => {
  const explanationName = "Feature Attribution";
  const code = `model.saliency_explainer("${id}")`;
  return (
    <ExplanationSuggestion
      explanationName={explanationName}
      code={code}
    ></ExplanationSuggestion>
  );
};

const ContrastiveSuggestion = ({ id }) => {
  const explanationName = "Contrastive explainer";
  const subText = "This will give you feature importance for a specific token";
  const code = `model.contrastive_explainer("${id}", "<token>")`;

  return (
    <ExplanationSuggestion
      explanationName={explanationName}
      subText={subText}
      code={code}
    ></ExplanationSuggestion>
  );
};

const SuggestionRenderer = (explanationName, _id) => {
  switch (explanationName) {
    case CONTRASTIVE:
      return <ContrastiveSuggestion id={_id} />;
    case FEATURE_ATTRIBUTION:
      return <FeatureAttrSuggestion id={_id} />;
    default:
      return <div>Unknown explainer</div>;
  }
};

export default SuggestionRenderer;
