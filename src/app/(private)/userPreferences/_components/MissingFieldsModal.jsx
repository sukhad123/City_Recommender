"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export default function MissingFieldsModal({ isOpen, onClose, fields = [] }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        <ModalHeader>Missing Required Fields</ModalHeader>
        <ModalBody>
          <p>Please complete the following before submitting:</p>
          <ul className="list-disc pl-5">
            {fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
