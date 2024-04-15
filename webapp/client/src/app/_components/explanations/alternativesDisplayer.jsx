"use client";
import { maxDecimals, removeSpecialChars } from "utils/strings";

const Alternative = ({ index, alternative }) => {
  const score = maxDecimals(alternative?.score, 2);
  const token = removeSpecialChars(alternative?.token);
  return (
    <p className={index === 0 ? "font-bold" : ""}>
      {token} <span className="text-xs">({score})</span>
    </p>
  );
};

const AlternativesList = ({ key, alternatives }) => {
  return (
    <div className="flex flex-col">
      {alternatives?.map((alternative, index) => (
        <Alternative index={index} alternative={alternative} />
      ))}
    </div>
  );
};

const AlternativesDisplayer = ({ output_alternatives }) => {
  return (
    <div>
      <p>What were the alternatives?</p>
      <div className="flex flex-row space-x-4 max-w-full overflow-x-scroll">
        {output_alternatives?.map((alternatives, index) =>
          AlternativesList({ key: index, alternatives })
        )}
      </div>
    </div>
  );
};

export default AlternativesDisplayer;
