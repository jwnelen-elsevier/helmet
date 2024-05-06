import clsx from "clsx";
import {
  highCertainty,
  highColor,
  lowCertainty,
  lowColor,
  mediumColor,
} from "utils/constants";

import { toPercentageString } from "utils/strings";

const Legenda = () => {
  return (
    <div className="border rouned p-2 flex flex-col space-y-2 items-center w-80">
      <h3>Legenda</h3>
      <div className="w-full flex bg-gradient-to-r from-red-500 via-white to-blue-500 py-1 px-2 rounded ">
        <span className="text-xs">Neg imp</span>
        <div className="flex-grow text-xs">No imp</div>
        <span className="text-xs">Pos imp</span>
      </div>
      <span className="bg-slate-400 rounded p-1 text-sm max-w-32">
        Selected Token
      </span>
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

export default Legenda;
