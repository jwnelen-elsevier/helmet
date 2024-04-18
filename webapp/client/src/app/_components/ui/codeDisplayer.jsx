import CopyableText from "./copyableText";

const CodeDisplayer = ({ code }) => {
  return (
    <CopyableText text={code}>
      <code className="border-2 rounded font-mono text-left text-sm p-2 ">
        {code}
      </code>
    </CopyableText>
  );
};
export default CodeDisplayer;
