"use client";
import { maxDecimals, removeSpecialChars } from "utils/strings";

const AlternativesDisplayer = ({ output_alternatives }) => {
  return (
    <div>
      {output_alternatives.map((alternative, index) => {
        const score = maxDecimals(alternative?.score, 2);
        const token = removeSpecialChars(alternative?.token);
        return (
          <div key={index}>
            <p className={index === 0 ? "font-bold" : ""}>
              {token} <span className="text-xs">({score})</span>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AlternativesDisplayer;
