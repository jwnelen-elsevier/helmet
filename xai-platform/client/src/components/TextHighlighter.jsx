// Create a component that will highlight text
const TextHighlighter = ({
  text,
  fAttribution,
  showAttributions = true,
  ...props
}) => {
  const lowest = -1;
  const highest = 1;

  const color = (value) => {
    // Map to new range of 0 to 1000 with interval of 50
    const newRange = 900;
    const oldRange = highest - lowest;
    const newValue = ((value - lowest) * newRange) / oldRange;
    const newInterval = 100;
    const colorSaturation = Math.floor(newValue / newInterval) * newInterval;
    let colorHue = value < 0 ? "red" : "green";
    // Kind of threshold for when we are highlighting
    colorHue = Math.abs(value) < 0.1 ? "white" : colorHue;

    // Treshold for white text on dark background
    if (colorSaturation > 400) {
      return `text-white bg-${colorHue}-${colorSaturation}`;
    }
    return `bg-${colorHue}-${colorSaturation}`;
  };

  const marginStyle = (word) => {
    const belongsToPreviousWord = word.includes("##");
    const trimmedWord = word.replace(/#/g, "");
    const m = belongsToPreviousWord ? "mr-2" : "ml-2";
    return { trimmedWord, m };
  };

  console.log(props);

  return (
    <div
      className={`flex justify-center flex-wrap items-center align-middle ${props.className}`}
    >
      {text.map((word, i) => {
        const f = fAttribution[i].toFixed(2) || 0;
        const { trimmedWord, m } = marginStyle(word);

        return (
          <div className="flex flex-col text-center ">
            <span className={`rounded-sm ${color(f)} ${m}`}>{trimmedWord}</span>
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
