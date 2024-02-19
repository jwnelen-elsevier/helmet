import { useState, useEffect } from "react";

const CollapsibleText = ({ text, maxLength }) => {
  const [showAll, setShowAll] = useState(false);
  // const [showText, setShowText] = useState(text);

  const displayedText = () => {
    if (text.split("").length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  };

  const showText = showAll ? text : displayedText();

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
      {showText}
      {text.split("").length > maxLength && <ExpandButton />}
    </p>
  );
};

export default CollapsibleText;
