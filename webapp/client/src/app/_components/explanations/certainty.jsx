import clsx from "clsx";
import { marginStyle, toPercentageString } from "utils/strings";

const lowCertainty = 0.1;
const highCertainty = 0.3;

const highColor = "bg-green-100";
const mediumColor = "bg-yellow-100";
const lowColor = "bg-red-100";

const CertaintyExplainer = ({ certainties, output }) => {
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
                {/* <div>{toPercentageString(certainties[i])}</div> */}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <span className={clsx("px-2 py-1 rounded", highColor)}>
          P {">="} {toPercentageString(highCertainty, 0)}
        </span>
        <span className={clsx("px-2 py-1 rounded", mediumColor)}>
          P {">="} {toPercentageString(lowCertainty, 0)}
        </span>
        <span className={clsx("px-2 py-1 rounded", lowColor)}>
          P {"<"} {toPercentageString(lowCertainty, 0)}
        </span>
      </div>
    </div>
  );
};

export default CertaintyExplainer;
