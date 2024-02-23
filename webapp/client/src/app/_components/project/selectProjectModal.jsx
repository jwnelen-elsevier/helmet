"use client"; // This is needed for the useDisclosure hook to work

import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { DownIcon } from "@/app/_components/ui/icons";
import { useSelectedProject } from "@/providers/project";

export default function SelectProjectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { selectedProject } = useSelectedProject();

  return (
    <div>
      <Button
        onPress={onOpen}
        color="default"
        variant="bordered"
        endContent={<DownIcon />}
      >
        {selectedProject?.name || "No Project Selected"},{" "}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            const selectProject = async () => {
              console.log("Selecting project");
              onClose();
            };
            return (
              <>
                <ModalHeader>Select a project</ModalHeader>
                <ModalBody></ModalBody>
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
