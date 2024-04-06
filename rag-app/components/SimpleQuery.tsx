"use client";

import React, { useState } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { PressEvent } from "@react-types/shared";
import axios from "axios";
import { Spinner } from "@nextui-org/spinner";

const SimpleQuery = () => {
  const [query, setQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleButtonPress = () => {
    if (query === "") {
      handleOpen();
    } else {
      fetchQueryResult();
    }
  };

  const handleOpen = () => {
    onOpen();
  };

  const fetchQueryResult = async () => {
    setLoading(true);

    const base_url = "http://127.0.0.1:8000";

    try {
      const response = await axios.get(`${base_url}/simple-query/${query}`);

      if (response.data) {
        setAnswer(response.data["Result"].response);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Modal backdrop="blur" size="md" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose: ((e: PressEvent) => void) | undefined) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Error Status
              </ModalHeader>
              <ModalBody>
                <p>Query cannot be empty. Please enter something !</p>
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

      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
        }}
        className="w-full"
      >
        <Input
          type="text"
          variant="bordered"
          placeholder="Enter your query for the Paul Graham Essay"
          color="secondary"
          value={query}
          onValueChange={setQuery}
        />
        <Button
          variant="ghost"
          color="secondary"
          size="lg"
          className="ml-5"
          onClick={handleButtonPress}
        >
          Submit
        </Button>
      </div>

      <div className="mt-10 flex-1 w-full">
        {loading ? (
          <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center'}}>
            <Spinner color="secondary" />
          </div>
        ) : (
          <>
            {answer === "" ? null : (
              <div>
                <p
                  style={{ fontSize: 25, fontWeight: "bold", marginBottom: 15 }}
                >
                  Query Answer
                </p>
                <Textarea
                  isReadOnly
                  variant="bordered"
                  color="secondary"
                  defaultValue={answer}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleQuery;
