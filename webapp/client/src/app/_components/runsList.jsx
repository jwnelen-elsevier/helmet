"use client";
import TextHighlighter from "./textHighlighter";
import { useState } from "react";
import { deleteRun } from "@/api/runs";
import { DeleteIcon, DetailsIcon } from "@/app/_components/ui/icons";
import Link from "next/link";
import Modal from "@/app/_components/modal";
import clsx from "clsx";
import { deleteAllRuns } from "@/api/runs";

const Runs = ({ runs, params }) => {
  const show = params?.show;
  const toDeleteId = params?.id;

  const [showAttributions, s] = useState(false);
  const [runState, setRuns] = useState(runs);

  const maxLetters = 100;

  if (!runState) {
    return <h2 className="">No Runs to display</h2>;
  }

  const deleteR = async (id) => {
    deleteRun(id).then((res) => {
      if (res.deletedCount === 1) {
        const r = runState.filter((run) => run._id !== id);
        setRuns(r);
      } else {
        console.log("Failed to delete run with id: ", id);
      }
    });
  };

  const deleteAll = async () => {
    deleteAllRuns().then((res) => {
      if (res.deletedCount > 0) {
        setRuns([]);
      } else {
        console.log("Failed to delete all runs");
      }
    });
    console.log("delete all runs");
  };

  const getDateString = (date) => {
    let d = new Date(date);
    // by setting the locale, we are not getting the hydration error of Nextjs.
    return `${d.toLocaleTimeString("nl-NL")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <h2 className="">All runs ({runState.length})</h2>
      {runState?.map((run, index) => {
        const { date, output, input, explanation, input_tokens, _id } = run;
        const { input_attribution, explanation_method } = explanation;
        const InputTruncated =
          input.length > maxLetters
            ? input.substring(0, maxLetters) +
              "..." +
              input.substring(input.length - maxLetters, input.length)
            : input;

        const isToBeDeleted = toDeleteId === _id;

        return (
          <div
            key={index}
            className={clsx(
              "flex flex-row p-2 hover:bg-gray-200 hover:rounded transition duration-100 ease-in-out",
              isToBeDeleted ? "bg-red-200" : ""
            )}
          >
            <TextHighlighter
              tokens={input_tokens}
              attributions={input_attribution}
              showAttributions={showAttributions}
            />
            <p className="px-2">Classified: {output}</p>
            {/* <p>{`Attribution method: ${explanation_method}`}</p> */}
            <p className="px-2">{getDateString(date)}</p>
            <div className="flex flex-col justify-center gap-1">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                <Link href={`/runs/?show=true&id=${_id}`}>
                  <DeleteIcon />
                </Link>
              </button>

              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                <Link href={`/details/${_id}`}>
                  <DetailsIcon />
                </Link>
              </button>
            </div>
          </div>
        );
      })}
      {show && (
        <Modal func={() => deleteR(toDeleteId)} backRef={"/runs"}></Modal>
      )}
      <button
        onClick={() => deleteAll()}
        className="flex bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
      >
        <DeleteIcon />
        Delete all runs
      </button>
    </div>
  );
};

export default Runs;
