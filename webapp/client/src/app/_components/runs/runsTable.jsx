"use client";
import CollapsibleText from "app/_components/ui/collapsibleText";
import { CompareIcon, DeleteIcon, DetailsIcon } from "app/_components/ui/icons";
import { deleteAllRuns, deleteRun } from "app/actions/actions";
import Link from "next/link";
import { useSelectedProject } from "providers/project";
import { useEffect, useState } from "react";
import { getDateString } from "utils/strings";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
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

const Runs = ({ runs }) => {
  const [runState, setRuns] = useState([]);
  const { selectedProject } = useSelectedProject();

  useEffect(() => {
    if (!selectedProject) return;
    const filteredRuns = runs.filter(
      (run) => `${run.project_id}` === `${selectedProject._id}`
    );
    setRuns(filteredRuns);
  }, [selectedProject, runs]);

  // This forces a rerender when a run is deleted
  // useEffect(() => {
  //   if (!toDeleteId) return;
  //   setRuns(runs);
  // }, [toDeleteId, runs]);

  const maxLength = 200;

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
    deleteAllRuns(selectedProject._id).then((res) => {
      if (res.deletedCount > 0) {
        setRuns([]);
      } else {
        console.log("Failed to delete all runs");
      }
    });
  };

  const getModelType = (type) => {
    return model_types[type];
  };

  const Filter = () => {
    return <div className="flex items-center gap-2"></div>;
  };

  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const twoKeysSelected = selectedKeys.size === 2;
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="">Runs ({runState.length})</h2>
      <Filter></Filter>
      <Table
        className="text-left"
        removeWrapper
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        selectionMode="multiple"
        onRowAction={() => {}} // Prevents selection on row click
        aria-label="Example static collection table"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={runState} emptyContent={"No rows to display."}>
          {(row) => {
            return (
              <TableRow key={row._id}>
                <TableCell>
                  <CollapsibleText
                    text={row?.input?.prompt || ""}
                    maxLength={maxLength}
                  ></CollapsibleText>
                </TableCell>
                <TableCell>{row.output.output_str}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs">
                    {row.model_checkpoint} ({getModelType(row.model_type)})
                  </span>
                </TableCell>
                <TableCell>{getDateString(row.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tooltip
                      showArrow={true}
                      content="Show explanation details"
                    >
                      <Link
                        className="text-sm text-default-400 cursor-pointer"
                        href={`/details/${row._id}`}
                      >
                        <DetailsIcon />
                      </Link>
                    </Tooltip>
                    <Tooltip showArrow={true} content="Delete run">
                      <Link
                        className="text-sm text-red-400 cursor-pointer"
                        href={`/runs/?show=true&id=${row._id}`}
                        scroll={false}
                      >
                        <DeleteIcon />
                      </Link>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      <Button
        className={`${twoKeysSelected ? "bg-green-500" : ""}`}
        disabled={!twoKeysSelected}
        onClick={() => {
          const [a, b] = [...selectedKeys];
          window.location.href = `/compare/${a}/${b}`;
        }}
      >
        <CompareIcon />
        {twoKeysSelected ? "Compare selected" : "Select two to compare"}
      </Button>
    </div>
  );
};

export default Runs;
