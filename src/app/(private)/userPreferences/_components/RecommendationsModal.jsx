"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export default function RecommendationsModal({
  isOpen,
  onClose,
  title = "City Recommendations",
  message = "",
  recommendations = [],
  limit = 5,
}) {
  const list = Array.isArray(recommendations) ? recommendations.slice(0, limit) : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="lg">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {message ? <p className="mb-2">{message}</p> : null}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
