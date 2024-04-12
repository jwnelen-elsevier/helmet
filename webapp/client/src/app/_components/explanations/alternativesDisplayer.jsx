"use client";
import { maxDecimals, removeSpecialChars } from "utils/strings";

const AlternativesList = ({ key, alternatives }) =>
  alternatives.map((alternative, index) => {
    const score = maxDecimals(alternative?.score, 2);
    const token = removeSpecialChars(alternative?.token);
    return (
      <div>
        <p className={index === 0 ? "font-bold" : ""}>
          {token} <span className="text-xs">({score})</span>
        </p>
      </div>
    );
  });

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
