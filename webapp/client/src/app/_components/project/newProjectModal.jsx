"use client"; // This is needed for the useDisclosure hook to work
import { useState } from "react";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import TaskSelector from "app/_components/project/taskSelector";
import { useSelectedProject } from "providers/project";

const defaultFormData = {
  projectName: "",
  task: "q_a",
};

export default function CreateProjectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState(defaultFormData);

  const { createNewProject, selectProject } = useSelectedProject();

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTaskChange = (value) => {
    if (value === formData["task"] || !value) {
      return;
    }
    setFormData({ ...formData, task: value });
  };

  return (
    <div>
      <Button onPress={onOpen} variant="solid" color="primary">
        New Project
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            const createProjectHandler = async () => {
              const data = formData;
              const newP = await createNewProject(data);
              if (newP) {
                await selectProject(newP);
              }
              resetForm();
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
                  <Button color="primary" onPress={createProjectHandler}>
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
