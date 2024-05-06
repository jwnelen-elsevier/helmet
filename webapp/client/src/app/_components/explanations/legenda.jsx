import { Slider } from "@nextui-org/slider";
import { useCertaintyConstants } from "providers/certaintyConstants";

const Legenda = () => {
  const { lowCertainty, highCertainty, setLowCertainty, setHighCertainty } =
    useCertaintyConstants();

  const handleLowCertaintyChange = (v) => {
    const newVal = Math.min(v, highCertainty);
    setLowCertainty(newVal);
  };

  const handleHighCertaintyChange = (v) => {
    const newVal = Math.max(v, lowCertainty);
    setHighCertainty(newVal);
  };

  return (
    <div className="border rouned p-2 flex flex-col space-y-2 items-center w-96">
      <h3>Legenda</h3>
      <h4>Impact Scores</h4>
      <div className="w-full flex bg-gradient-to-r from-red-500 via-white to-blue-500 py-1 px-2 rounded ">
        <span className="text-xs">Neg imp</span>
        <div className="flex-grow text-xs">No imp</div>
        <span className="text-xs">Pos imp</span>
      </div>
      <h4>Selected Token</h4>
      <p className="bg-slate-400 rounded p-1 text-sm max-w-32">
        Currently selected
      </p>
      <h4>Certainty Color Thresholds</h4>
      <div className="flex flex-col gap-2 w-full">
        <Slider
          label="High Certainty Threshold"
          size="sm"
          value={highCertainty}
          onChange={(v) => handleHighCertaintyChange(v)}
          step={0.05}
          minValue={0}
          maxValue={1}
          color="success"
          formatOptions={{ style: "percent" }}
        />
        <Slider
          label="Medium Certainty Threshold"
          size="sm"
          value={
            lowCertainty === highCertainty
              ? lowCertainty
              : [lowCertainty, highCertainty]
          }
          isDisabled={true}
          step={0.05}
          minValue={0}
          maxValue={1}
          color="warning"
          formatOptions={{ style: "percent" }}
        />
        <Slider
          label="Low Certainty Threshold"
          size="sm"
          value={lowCertainty}
          onChange={(v) => handleLowCertaintyChange(v)}
          step={0.05}
          minValue={0}
          maxValue={1}
          color="danger"
          formatOptions={{ style: "percent" }}
        />
      </div>
    </div>
  );
};

export default Legenda;
