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

export default function SelectProjectModal({ show, projects, setProject }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Modal isOpen={show} onOpenChange={setProject}>
      <ModalHeader>Select a project</ModalHeader>
      <ModalContent></ModalContent>
    </Modal>
  );
}
