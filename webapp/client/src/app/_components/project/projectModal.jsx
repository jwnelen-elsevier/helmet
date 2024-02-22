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
import TaskSelector from "@/app/_components/project/taskSelector";

export default function CreateProjectModal({ createProjectFunc }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setForData] = React.useState({
    projectName: "",
    task: "q_a",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForData({ ...formData, [name]: value });
  };

  const handleTaskChange = (value) => {
    setForData({ ...formData, task: value });
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
                  Setup Wizard for new project
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Project Name"
                    placeholder="Name"
                    name="projectName"
                    labelPlacement="outside"
                    variant="bordered"
                    onChange={handleInputChange}
                  />
                  <TaskSelector
                    val={formData["task"]}
                    onChangeTask={handleTaskChange}
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
