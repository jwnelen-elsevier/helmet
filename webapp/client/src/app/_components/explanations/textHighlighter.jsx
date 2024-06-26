// Create a component that will highlight text
import clsx from "clsx";
import { useState } from "react";
import { marginStyle } from "utils/strings";

const TextHighlighter = ({
  tokens,
  attributions,
  hoveredIndex = -1,
  setHoveredIndex = () => {},
}) => {
  const showAttributions = false;
  const lowest = -0.2;
  const highest = 0.2;
  const [locked, setLocked] = useState(false);

  const color = (value) => {
    // Map to new range of 0 to 1000 with interval of 50
    const newRange = 500;
    const oldRange = highest - lowest;
    const newValue = ((value - lowest) * newRange) / oldRange;
    const newInterval = 100;
    const colorSaturation = Math.floor(newValue / newInterval) * newInterval;
    let colorHue = value < 0 ? "red" : "blue";
    // Kind of threshold for when we are highlighting
    colorHue = Math.abs(value) < 0.02 ? "white" : colorHue;

    // Treshold for white text on dark background
    if (colorSaturation > 100) {
      return `bg-${colorHue}-${colorSaturation}`;
    }
    return `bg-${colorHue}-${colorSaturation}`;
  };

  return (
    <div className={`flex justify-center flex-wrap items-center content-start`}>
      {tokens?.map((word, i) => {
        const attrExists =
          attributions && attributions.length > 0 && attributions[i] !== null;

        let score = attrExists ? attributions[i] : 0;
        const f = score?.toFixed(2) || 0;
        const { trimmedWord, addSpace } = marginStyle(word);
        return (
          <div className="flex flex-col text-center" key={i}>
            <div>
              {addSpace && <span className="whitespace-pre-line">&nbsp;</span>}
              <span
                className={clsx(`rounded-sm whitespace-pre-line`, color(f), {
                  "bg-slate-400": i === hoveredIndex,
                  "bg-slate-300": locked && i === hoveredIndex,
                  "hover:cursor-default": !locked && i === hoveredIndex,
                })}
                onClick={() => setLocked((prev) => !prev)}
                onMouseEnter={() => {
                  if (!locked) setHoveredIndex(i);
                }}
              >
                {trimmedWord}
              </span>
            </div>
            {showAttributions && (
              <span className="rounded-sm text-xs">{f}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TextHighlighter;
