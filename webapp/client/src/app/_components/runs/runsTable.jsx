"use client";
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
import { deleteAllRuns, deleteRun } from "app/actions/actions";
import Link from "next/link";
import { useSelectedProject } from "providers/project";
import { useEffect, useState } from "react";
import { CONTRASTIVE, SALIENCY } from "utils/constants";
import { getTimeString } from "utils/strings";
import CollapsibleText from "../ui/collapsibleText";
import {
  CheckIcon,
  CloseIcon,
  CompareIcon,
  DeleteIcon,
  DetailsIcon,
} from "../ui/icons";
import SearchBar from "../ui/searchBar";
import DeleteAllRunsModal from "./deleteAllModal";

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
    name: "Expl (CO, FA)",
    uid: "expl",
  },
  {
    name: "Actions",
    uid: "actions",
  },
];

const Runs = ({ runs }) => {
  const [runState, setRuns] = useState([]);
  const { selectedProject } = useSelectedProject();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!selectedProject) return;
    const filteredRuns = runs.filter(
      (run) => `${run.project_id}` === `${selectedProject._id}`
    );

    if (!searchInput) {
      setRuns(filteredRuns);
      return;
    }
    const searchedRuns = filteredRuns.filter((run) =>
      run.input.prompt.toLowerCase().includes(searchInput.toLowerCase())
    );

    setRuns(searchedRuns);
  }, [selectedProject, searchInput, runs]);

  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const twoKeysSelected = selectedKeys.size === 2;

  const maxLength = 200;

  const deleteR = async (id) => {
    deleteRun(id).then((res) => {
      if (res.deletedCount === 1) {
        setRuns((oldState) =>
          oldState.filter((run) => `${run._id}` !== `${id}`)
        );
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

  const handleOnClose = (decision) => {
    if (decision) {
      deleteAll();
    }
    setOpenDeleteModal(false);
  };

  function DeleteAllButton() {
    return (
      <Button
        color="danger"
        onClick={() => {
          setOpenDeleteModal(true);
        }}
        startContent={<DeleteIcon />}
      >
        Delete All
      </Button>
    );
  }

  function DeleteButton({ id }) {
    return (
      <Tooltip content="Delete run">
        <span
          className=" text-red-400 cursor-pointer"
          onClick={() => deleteR(id)}
        >
          <DeleteIcon />
        </span>
      </Tooltip>
    );
  }

  function CompareButton() {
    return (
      <Button
        color={twoKeysSelected ? "success" : "default"}
        disabled={!twoKeysSelected}
        onClick={() => {
          const [a, b] = [...selectedKeys];
          window.location.href = `/compare/${a}/${b}`;
        }}
        startContent={<CompareIcon />}
      >
        Compare
      </Button>
    );
  }

  const NotExplained = () => (
    <span className={"text-gray-400 text-sm"}>
      <CloseIcon></CloseIcon>
    </span>
  );

  const Explained = () => (
    <span className={"text-green-500 text-sm"}>
      <CheckIcon></CheckIcon>
    </span>
  );

  function ExplanationsDone({ contrastive, attribution }) {
    return (
      <div className="flex gap-2">
        <span>{contrastive ? <Explained /> : <NotExplained />}</span>
        <span>{attribution ? <Explained /> : <NotExplained />}</span>
      </div>
    );
  }

  const Actions = () => {
    return (
      <div className="flex w-full gap-4">
        <div className="flex-grow">
          <SearchBar value={searchInput} setValue={setSearchInput} />
        </div>
        <CompareButton />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <DeleteAllRunsModal
        shouldBeOpen={openDeleteModal}
        onCloseDecision={handleOnClose}
      ></DeleteAllRunsModal>
      <h2 className="">Runs ({runState.length})</h2>
      {Actions()}
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
            const explanationsDone = row?.explanations?.map(
              (expl) => expl.explanation_method
            );
            const hasContrastiveExplanation =
              explanationsDone.includes(CONTRASTIVE);
            const hasAttributionExplanation =
              explanationsDone.includes(SALIENCY);
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
                    {row.model_checkpoint}
                  </span>
                </TableCell>
                <TableCell>{getTimeString(row.date)}</TableCell>
                <TableCell>
                  <ExplanationsDone
                    contrastive={hasContrastiveExplanation}
                    attribution={hasAttributionExplanation}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tooltip showArrow={true} content="Show Details">
                      <Link
                        className="text-sm text-blue-500 cursor-pointer"
                        href={`/details/${row._id}`}
                      >
                        <DetailsIcon />
                      </Link>
                    </Tooltip>
                    <DeleteButton id={row._id} />
                  </div>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      <DeleteAllButton />
    </div>
  );
};

export default Runs;
