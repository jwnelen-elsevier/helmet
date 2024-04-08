import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

import CopyableText from "app/_components/ui/copyableText";
import { CheckIcon } from "app/_components/ui/icons";
import clsx from "clsx";
import { getDateString } from "utils/strings";

const columns = [
  {
    name: "",
    uid: "select",
  },
  {
    name: "Project Name",
    uid: "projectName",
  },
  {
    name: "ID",
    uid: "_id",
  },
  {
    name: "Creation date",
    uid: "date",
  },
];

function selectProjectList({ selectProject, projects, selectedProject }) {
  const isSelectedProject = (p) => {
    return `${selectedProject?._id}` === `${p._id}`;
  };

  return (
    <Table removeWrapper aria-label="Table of projects">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={projects}>
        {(project) => (
          <TableRow key={project._id}>
            <TableCell>{isSelectedProject(project) && <CheckIcon />}</TableCell>
            <TableCell
              onClick={() => selectProject(project)}
              className={clsx(
                `cursor-pointer underline w-min-content hover:bg-slate-100`,
                isSelectedProject(project) && `font-bold`
              )}
            >
              {project.projectName}
            </TableCell>
            <TableCell>
              <CopyableText text={project._id}></CopyableText>
            </TableCell>
            <TableCell>{getDateString(project.date)}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default selectProjectList;
