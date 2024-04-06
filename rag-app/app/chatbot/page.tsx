"use client";

import React, { useEffect, useState } from "react";
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
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import { title, subtitle } from "@/components/primitives";

const page = () => {
  const [query, setQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ question: string; answer: string }[]>([]);

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
      const response = await axios.get(`${base_url}/chat-bot/${query}`);

      if (response.data) {
        const answer = response.data["Result"].response;

        const object = {
          question: query,
          answer: answer,
        };
        setData([...data, object]);
        setQuery("");
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
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      className="w-full"
    >
      <div className="inline-block max-w-lg text-center justify-center mb-5">
        <h1 className={title()}>Interact with the &nbsp;</h1>
        <h1 className={title({ color: "violet" })}>Chatbot&nbsp;</h1>
        {/* <br /> */}
        {/* <h1 className={title()}>with this website</h1> */}
        <h2 className={subtitle({ class: "mt-4" })}>
          This chatbot is currently indexed on the 'Paul Graham Essay' data.
        </h2>
      </div>
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
          placeholder="Ask Anything "
          color="secondary"
          value={query}
          onValueChange={setQuery}
        />
        {loading ? (
          <div className="ml-2">
            <Spinner color="secondary" />
          </div>
        ) : (
          <Button
            variant="ghost"
            color="secondary"
            size="lg"
            className="ml-5"
            onClick={handleButtonPress}
          >
            Submit
          </Button>
        )}
      </div>

      <div
        style={{ display: "flex", flexDirection: "column" }}
        className="w-full mt-8"
      >
        {data.map((item) => {
          return (
            <>
              <div
                style={{
                  display: "flex",
                  marginRight: 0,
                  marginLeft: 350,
                  flex: 1,
                  flexDirection: "row",
                  marginBottom: 25,
                  marginTop: 25
                }}
              >
                <Textarea
                  isReadOnly
                  variant="bordered"
                  color="secondary"
                  defaultValue={item.question}
                  className="mr-5"
                />
                <Avatar
                  showFallback
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                  color="secondary"
                  isBordered
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginRight: 350,
                  marginLeft: 0,
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <Avatar
                  showFallback
                  src="https://images.unsplash.com/broken"
                  color="secondary"
                />
                <Textarea
                  isReadOnly
                  variant="bordered"
                  color="secondary"
                  defaultValue={item.answer}
                  className="ml-5"
                />
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default page;
