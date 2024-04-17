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

export default function DeleteAllRunsModal({ shouldBeOpen, onCloseDecision }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    isOpen: shouldBeOpen,
  });

  const onOpenChangeHanlder = () => {
    onOpenChange();
    onCloseDecision(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChangeHanlder} size="md">
      <ModalContent>
        {() => {
          return (
            <>
              <ModalHeader>Delete all runs in this project??</ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button onClick={() => onCloseDecision(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={() => onCloseDecision(true)} color="danger">
                  Confirm
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
