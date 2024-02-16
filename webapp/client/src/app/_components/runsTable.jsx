"use client";
import { useState, useEffect } from "react";
import { deleteRun, deleteAllRuns } from "@/api/runs";
import { DeleteIcon, DetailsIcon } from "@/app/_components/ui/icons";
import Link from "next/link";
import Modal from "@/app/_components/modal";
import clsx from "clsx";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";

const model_types = {
  enc: "Encoder-only",
  enc_dec: "Encoder-Decoder",
  dec: "Decoder-only",
};

const columns = [
  {
    name: "Input",
    uid: "input",
  },
  {
    name: "Output",
    uid: "output",
  },
  {
    name: "GT",
    uid: "gt",
  },
  {
    name: "Model",
    uid: "model",
  },
  {
    name: "Time",
    uid: "time",
  },
  {
    name: "Actions",
    uid: "actions",
  },
];

const Runs = ({ runs, params }) => {
  const show = params?.show;
  const toDeleteId = params?.id;

  const [runState, setRuns] = useState(runs);

  // This forces a rerender when a run is deleted
  useEffect(() => {
    setRuns(runs);
  }, [toDeleteId]);

  const maxLetters = 100;

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

  const getModelType = (type) => {
    return model_types[type];
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="">All runs ({runState.length})</h2>
      <Table
        className="text-left"
        removeWrapper
        aria-label="Example static collection table"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={runState} emptyContent={"No rows to display."}>
          {(row) => {
            const isToBeDeleted = toDeleteId === row._id;
            const isCorrect = `${row.output}` === `${row.groundtruth}`;

            return (
              <TableRow
                key={row._id}
                className={clsx(
                  isToBeDeleted ? "bg-red-400" : "",
                  isCorrect
                    ? "bg-green-100 hover:bg-green-200"
                    : "bg-red-100 hover:bg-red-200"
                )}
              >
                <TableCell>{row.input}</TableCell>
                <TableCell>{row.output}</TableCell>
                <TableCell>{row.groundtruth}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs">
                    {row.model_checkpoint} ({getModelType(row.model_type)})
                  </span>
                </TableCell>
                <TableCell>{getDateString(row.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link
                      className="text-sm text-default-400 cursor-pointer"
                      href={`/details/${row._id}`}
                    >
                      <DetailsIcon />
                    </Link>
                    <Link
                      className="text-sm text-red-400 cursor-pointer"
                      href={`/runs/?show=true&id=${row._id}`}
                      scroll={false}
                    >
                      <DeleteIcon />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      {show && (
        <Modal func={() => deleteR(toDeleteId)} backRef={"/runs"}></Modal>
      )}
      {runState.length > 0 && (
        <Button
          onClick={() => deleteAll()}
          className="flex bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
        >
          <DeleteIcon />
          Delete all runs
        </Button>
      )}
    </div>
  );
};

export default Runs;
