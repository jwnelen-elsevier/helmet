// Create a component that will highlight text
"use client";
const TextHighlighter = ({
  tokens,
  attributions,
  showAttributions = true,
  ...props
}) => {
  const lowest = -1;
  const highest = 1;

  const color = (value) => {
    // Map to new range of 0 to 1000 with interval of 50
    const newRange = 500;
    const oldRange = highest - lowest;
    const newValue = ((value - lowest) * newRange) / oldRange;
    const newInterval = 100;
    const colorSaturation = Math.floor(newValue / newInterval) * newInterval;
    let colorHue = value < 0 ? "red" : "green";
    // Kind of threshold for when we are highlighting
    colorHue = Math.abs(value) < 0.1 ? "white" : colorHue;

    // Treshold for white text on dark background
    if (colorSaturation > 100) {
      return `text-white bg-${colorHue}-${colorSaturation}`;
    }
    return `bg-${colorHue}-${colorSaturation}`;
  };

  const isNewWord = (word) =>
    !word.includes("##") ||
    word.includes("Ġ") ||
    !word.includes([",", "!", "."]);

  const marginStyle = (word) => {
    const addSpace = isNewWord(word);
    let trimmedWord = word.replace(/#/g, "").replace(/Ġ/g, "");
    return { trimmedWord, addSpace };
  };

  return (
    <div
      className={`flex justify-center flex-wrap items-center align-middle ${props.className}`}
    >
      {tokens?.map((word, i) => {
        let score = attributions ? attributions[i] : 0;
        const f = score.toFixed(2) || 0;
        const { trimmedWord, addSpace } = marginStyle(word);

        return (
          <div className="flex flex-col text-center " key={i}>
            <div>
              {addSpace && <span className="whitespace-pre-line">&nbsp;</span>}
              <span className={`rounded-sm whitespace-pre-line${color(f)}`}>
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
