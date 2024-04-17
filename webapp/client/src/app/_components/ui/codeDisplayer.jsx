import CopyableText from "./copyableText";

const CodeDisplayer = ({ code }) => {
  return (
    <code className="border border-r-1 font-mono text-left p-1">
      <CopyableText text={code} />
    </code>
  );
};
export default CodeDisplayer;
