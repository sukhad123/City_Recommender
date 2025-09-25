"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function RejectModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader className="text-red-500">Restricted</ModalHeader>
        <ModalBody>
          <p className="text-gray-700">
            You must be logged in to submit a review.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
