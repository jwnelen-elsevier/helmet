"use client"; // This is needed for the useDisclosure hook to work

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import SelectProjectList from "app/_components/project/selectProjectList";
import { DownIcon } from "app/_components/ui/icons";
import { useSelectedProject } from "providers/project";

export default function SelectProjectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { projects, selectedProject, selectProject } = useSelectedProject();

  return (
    <div className="">
      <Button
        onPress={onOpen}
        color="white"
        variant="bordered"
        endContent={<DownIcon />}
      >
        {selectedProject?.projectName || "No Project Selected"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => {
            const selectP = (p) => {
              selectProject(p);
              onClose();
            };
            return (
              <>
                <ModalHeader>Select a project</ModalHeader>
                <ModalBody>
                  <SelectProjectList
                    selectProject={selectP}
                    projects={projects}
                    selectedProject={selectedProject}
                  ></SelectProjectList>
                </ModalBody>
                <ModalFooter>
                  <Button onPress={onClose}>Close</Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
}
