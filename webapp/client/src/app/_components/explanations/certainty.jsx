import clsx from "clsx";
import { marginStyle } from "utils/strings";

import { useCertaintyConstants } from "providers/certaintyConstants";
import { highColor, lowColor, mediumColor } from "utils/constants";

const CertaintyExplainer = ({ certainties, output }) => {
  const { highCertainty, lowCertainty } = useCertaintyConstants();

  const color = (value) =>
    value >= highCertainty
      ? highColor
      : value >= lowCertainty
        ? mediumColor
        : lowColor;

  return (
    <div>
      <div
        className={`flex justify-center flex-wrap items-center content-start mb-3`}
      >
        {output.map((word, i) => {
          const { trimmedWord, addSpace } = marginStyle(word);

          return (
            <div key={`key-${i}`}>
              <div
                className={clsx(
                  "flex flex-col text-center gap-2",
                  color(certainties[i])
                )}
                key={i}
              >
                <div>
                  {addSpace && (
                    <span className="whitespace-pre-line">&nbsp;</span>
                  )}

                  <span className="rounded-sm whitespace-pre-line">
                    {trimmedWord}
                  </span>
                </div>
                {/* <div className="text-xs">
                  {toPercentageString(certainties[i], 0)}
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CertaintyExplainer;
