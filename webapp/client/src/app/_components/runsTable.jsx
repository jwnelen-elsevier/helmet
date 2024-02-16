"use client";
import { useState } from "react";
import { deleteRun, deleteAllRuns } from "@/api/runs";
import { DeleteIcon, DetailsIcon } from "@/app/_components/ui/icons";
import Link from "next/link";
import Modal from "@/app/_components/modal";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
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

  if (!runState || runState.length === 0) {
    return <h2 className="">No Runs to display</h2>;
  }

  return (
    <div className="text-left">
      <h2 className="">All runs ({runState.length})</h2>
      <Table aria-label="Example static collection table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={runState}>
          {(row) => (
            <TableRow key={row._id}>
              <TableCell>{row.input}</TableCell>
              <TableCell>{row.output}</TableCell>
              <TableCell>{row.groundtruth}</TableCell>
              <TableCell>
                <span className="font-mono text-xs">
                  {row.model_checkpoint} ({getModelType(row.model_type)}
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
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Runs;

{
  /* <div className="flex flex-col gap-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableColumn>Model Type</TableColumn>
              <TableColumn>Model Name</TableColumn>
              <TableColumn>Run Name</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runState?.map((run, index) => {
              const { date, model_type, model_name, run_name, _id } = run;
              return (
                <TableRow key={index}>
                  <TableCell>{getModelType(model_type)}</TableCell>
                  <TableCell>{model_name}</TableCell>
                  <TableCell>{run_name}</TableCell>
                  <TableCell>{getDateString(date)}</TableCell>
                  <TableCell>
                    <Link href={`/runs/${_id}`}>
                      <a>
                        <DetailsIcon />
                      </a>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
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
    </div> */
}
