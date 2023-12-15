// Create a component that will highlight text
const TextHighlighter = ({ text, fAttribution, metaData }) => {
  const lowest = 0;
  const highest = 1;

  const color = (value) => {
    // Map to new range of 0 to 1000 with interval of 50
    const newRange = 900;
    const oldRange = highest - lowest;
    const newValue = ((value - lowest) * newRange) / oldRange;
    const newInterval = 100;
    const newColor = Math.floor(newValue / newInterval) * newInterval;
    if (newColor > 400) {
      return `text-white bg-red-${newColor}`;
    }
    return `bg-red-${newColor}`;
  };

  const d = new Date(metaData.date);
  const date = d.toLocaleTimeString("nl-NL");

  const meta = { ...metaData };
  delete meta.date;

  return (
    <tr className="border-b">
      <td className="flex justify-center items-center align-middle">
        {text.split(" ").map((word, i) => {
          return (
            <div className="flex flex-col text-center gap-1 px-1">
              <span className={`p-1 rounded-sm ${color(fAttribution[i])}`}>
                {word}
              </span>
              <span className="rounded-sm">{fAttribution[i]}</span>
            </div>
          );
        })}
      </td>
      <td>{date}</td>
      <td className="font-mono text-sm">{JSON.stringify(meta)}</td>
    </tr>
  );
};

export default TextHighlighter;
