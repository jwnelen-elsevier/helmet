// Create a component that will highlight text
const TextHighlighter = ({ text, fAttribution }) => {
  const lowest = Math.min(...fAttribution);
  const highest = Math.max(...fAttribution);

  const color = (value) => {
    console.log(value);
    // Map to new range of 0 to 1000 with interval of 50
    const newRange = 900;
    const oldRange = highest - lowest;
    const newValue = ((value - lowest) * newRange) / oldRange;
    const newInterval = 100;
    const newColor = Math.floor(newValue / newInterval) * newInterval;
    console.log(newColor);
    if (newColor === 0) return `bg-gray-200`;
    if (newColor > 400) {
      return `text-white bg-red-${newColor}`;
    }
    return `bg-red-${newColor}`;
  };

  return (
    <div className="flex gap-2">
      {text.split(" ").map((word, i) => {
        return (
          <div className="flex flex-col text-center gap-1">
            <span className={`p-1 rounded-sm ${color(fAttribution[i])}`}>
              {word}
            </span>
            <span className="border rounded-sm">{fAttribution[i]}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TextHighlighter;
