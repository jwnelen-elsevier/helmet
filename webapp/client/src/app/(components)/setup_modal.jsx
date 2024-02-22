"use client"; // This is needed for the useDisclosure hook to work

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";

export default function CreateProjectModal({ createProjectFunc }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setForData] = React.useState({
    projectName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForData({ ...formData, [name]: value });
  };

  return (
    <div>
      <Button onPress={onOpen}>New Project</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            const createProject = async () => {
              const data = formData;
              await createProjectFunc(data);
              onClose();
            };
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Setup Wizard for New Project
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Project Name"
                    placeholder="Name"
                    name="projectName"
                    variant="bordered"
                    onChange={handleInputChange}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={createProject}>
                    Create Project
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
}
