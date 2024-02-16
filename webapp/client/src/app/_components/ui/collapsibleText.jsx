import { useState, useEffect } from "react";

const CollapsibleText = ({ text, maxLength }) => {
  const [showAll, setShowAll] = useState(false);
  const [showText, setShowText] = useState(text);

  useEffect(() => {
    if (text.split("").length > maxLength) {
      setShowText(text.substring(0, maxLength) + "...");
    } else {
      setShowText(text);
    }
    return () => {};
  }, [text]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const ExpandButton = () => (
    <span className="cursor-pointer text-blue-400" onClick={toggleShowAll}>
      {showAll ? "Less" : "More"}
    </span>
  );

  return (
    <p>
      {showAll ? text : showText}
      {text.split("").length > maxLength && <ExpandButton />}
    </p>
  );
};

export default CollapsibleText;
