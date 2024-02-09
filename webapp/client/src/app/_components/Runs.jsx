"use client";
import TextHighlighter from "./TextHighlighter";
import { useState } from "react";

const Runs = ({ runs }) => {
  const [showAttributions, s] = useState(false);

  const maxLetters = 100;

  if (!runs) {
    return (
      <div className="card">
        <h5 className="card-title">No Runs</h5>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xl bold">All Runs ({runs.length})</p>
      {runs?.map((run, index) => {
        const { date, output, input, explanation, input_tokens, _id } = run;
        console.log(_id);
        const { input_attribution } = explanation;
        const InputTruncated =
          input.length > maxLetters
            ? input.substring(0, maxLetters) +
              "..." +
              input.substring(input.length - maxLetters, input.length)
            : input;
        const dateFormatted = new Date(date).toLocaleTimeString();

        return (
          <div key={index} className="flex flex-row py-2">
            <TextHighlighter
              tokens={input_tokens}
              attributions={input_attribution}
              showAttributions={showAttributions}
            />
            <p className="px-2">Classified: {output}</p>
            <p className="px-2">Date: {dateFormatted}</p>
            <div>
              <button
                onClick={() => s(!showAttributions)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Runs;
