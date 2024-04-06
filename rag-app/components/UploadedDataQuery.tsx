import { Button } from "@nextui-org/button";
import axios from "axios";
import React, { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { PressEvent } from "@react-types/shared";

const UploadedDataQuery = () => {
  const [file, setFile] = useState(null);
  const [dataUploadStatus, setDataUploadStatus] = useState(false);
  const [indexLoading, setIndexLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [answer, setAnswer] = useState("");

  const handleFileUpload = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmitFile = async (event: any) => {
    event.preventDefault();

    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, file?.name);

    const base_url = "http://127.0.0.1:8000/";
    setIndexLoading(true);
    try {
      const response = await axios.post(`${base_url}fileUpload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        if (response.data.status === "Indexing Complete") {
          setDataUploadStatus(true);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIndexLoading(false);
    }
  };

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
    setQueryLoading(true);

    const base_url = "http://127.0.0.1:8000";

    try {
      const response = await axios.get(
        `${base_url}/query-from-uploaded-data/${query}`
      );

      if (response.data) {
        setAnswer(response.data["Result"].response);
      }
    } catch (error) {
      alert(error);
    } finally {
      setQueryLoading(false);
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
      {dataUploadStatus ? (
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            flexDirection: "column",
          }}
          className="w-full"
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
              placeholder="Query from your own uploaded Data"
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
            {queryLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner color="secondary" />
              </div>
            ) : (
              <>
                {answer === "" ? null : (
                  <div>
                    <p
                      style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        marginBottom: 15,
                      }}
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
      ) : (
        <>
          {indexLoading ? (
            <Spinner color="secondary" />
          ) : (
            <form onSubmit={handleSubmitFile}>
              <Button variant="solid" color="secondary">
                <input type="file" onChange={handleFileUpload} />
              </Button>

              {file ? (
                <div
                  style={{
                    display: "flex",
                    marginTop: 20,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: 20, color: "gray" }}>
                    File Selected :{" "}
                  </p>
                  <p style={{ marginLeft: 10, fontSize: 15 }}>{file?.name}</p>
                  <div style={{ marginLeft: 15 }}>
                    <Button variant="bordered" color="secondary" type="submit">
                      Submit
                    </Button>
                  </div>
                </div>
              ) : null}
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default UploadedDataQuery;
