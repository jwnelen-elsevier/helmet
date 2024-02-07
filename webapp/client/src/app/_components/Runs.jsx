import { fetchRuns } from "@/api/runs";

const Runs = async () => {
  const runs = await fetchRuns();
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
      {runs.map((run, index) => {
        const { date, output, input } = run;
        const InputTruncated =
          input.length > maxLetters
            ? input.substring(0, maxLetters) +
              "..." +
              input.substring(input.length - maxLetters, input.length)
            : input;
        const dateFormatted = new Date(date).toLocaleTimeString();

        return (
          <div key={index} className="flex flex-row py-2">
            <p className="px-2 overflow-clip">Input: {InputTruncated}</p>
            <p className="px-2">Classified: {output}</p>
            <p className="px-2">Date: {dateFormatted}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Runs;
