// _components/ConfirmModal.jsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
export default function ConfirmModal({ isOpen, onClose, onConfirm, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onConfirm} isLoading={loading}>Yes, Delete</Button>
          <Button color="secondary" onPress={onClose} isDisabled={loading}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
