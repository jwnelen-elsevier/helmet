import { Snippet } from "@nextui-org/snippet";

const CodeDisplayer = ({ code }) => {
  return (
    <Snippet symbol="" radius="sm" color="default">
      {code}
    </Snippet>
  );
};
export default CodeDisplayer;
