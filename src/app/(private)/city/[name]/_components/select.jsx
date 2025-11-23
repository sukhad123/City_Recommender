"use client";
import { Button, Modal, ModalContent, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import CityComparePage from "./compare";
import { CitySearch } from "../../../profile-update/_components/CitySearch";

export default function SelectCity({ initialCity }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [value, setValue] = React.useState("");

  const handleCityChange = (city) => {
    setValue(city);
    onOpen();
  };

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <CitySearch
        value={value}
        onChange={handleCityChange}
        disabled={false}
        placeholder="Select a city"
      />
      <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <CityComparePage cityName1={initialCity} cityName2={value} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
