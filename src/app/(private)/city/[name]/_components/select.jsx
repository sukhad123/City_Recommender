"use client"
import React, { useEffect } from "react";
import {Select, SelectItem} from "@heroui/react";
import CityComparePage from "./compare";
import { cities } from '../../../../../utils/cities';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
export const animals = [
  {key: "cat", label: "Cat"},
  {key: "dog", label: "Dog"},
  {key: "elephant", label: "Elephant"},
  {key: "lion", label: "Lion"},
  {key: "tiger", label: "Tiger"},
  {key: "giraffe", label: "Giraffe"},
  {key: "dolphin", label: "Dolphin"},
  {key: "penguin", label: "Penguin"},
  {key: "zebra", label: "Zebra"},
  {key: "shark", label: "Shark"},
  {key: "whale", label: "Whale"},
  {key: "otter", label: "Otter"},
  {key: "crocodile", label: "Crocodile"},
];

export default function SelectCity({initialCity}) {
      const {isOpen, onOpen, onOpenChange} = useDisclosure()
    console.log("Inital City:", initialCity);
  const [value, setValue] = React.useState("");
  useEffect(() => {
   if(value)
   {
    onOpen();
   }
  }, [value]);

  const handleSelectionChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Select
        className="max-w-xs"
  
        placeholder="Select a city"
        selectedKeys={[value]}
        variant="bordered"
        onChange={handleSelectionChange}
      >
        {cities.map((city) => (
          <SelectItem key={city}>{city}</SelectItem>
        ))}
      </Select>
       <Modal size = "full" isOpen={isOpen} onOpenChange={onOpenChange}>
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

