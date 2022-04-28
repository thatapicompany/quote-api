import {
  Container,
  Stack,
  Text,
  Flex,
  Spinner,
  Heading,
  Fade,
  Button,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { IoReloadOutline } from "react-icons/io5";

import { useState, useEffect, useCallback } from "react";
const axios = require("axios").default;

export const Quote = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [data, setData] = useState<{ author: string; text: string }>();
  const [loaded, setLoaded] = useState(false);
  const [rotateQuote, setRotateQuote] = useState("rotate(355deg)");

  const getNewQuote = useCallback(() => {
    axios
      .get(process.env.REACT_APP_QUOTE_API_URL + "quotes/random/", {
        headers: {
          api_key: process.env.REACT_APP_API_KEY,
        },
      })
      .then((response: any) => {
        setData(response.data);
      })
      //.catch((error: any) => setError(error.message))
      .finally(() => {
        degrees();
        setLoaded(true);
        //onToggle();
        onOpen();
      });
  }, [isOpen, onOpen]);
  //fist run

  useEffect(() => {
    if (!data) {
      getNewQuote();
      return;
    }
  }, [data, getNewQuote, rotateQuote]);

  const degrees = () => {
    if (rotateQuote === "rotate(355deg)") {
      setRotateQuote("rotate(7deg)");
      return "rotate(7deg)";
    } else {
      setRotateQuote("rotate(355deg)");
      return "rotate(355deg)";
    }
  };
  if (loaded) {
    if (data)
      return (
        <Stack spacing={4} alignItems={"center"} px={8}>
          <Flex
            alignItems={"center"}
            align={"center"}
            justify={"center"}
            bg="whiteAlpha.400"
            rounded={"lg"}
            transform={rotateQuote}
            boxShadow={
              rotateQuote === "rotate(355deg)"
                ? "-7px 13px 12px 0px #000000b8"
                : "13px 13px 12px 0px #000000b8"
            }
            maxWidth={"26em"}
            mb={10}
            backgroundColor="#fff5c6"
          >
            <Container p={8}>
              <Fade in={isOpen}>
                <Stack spacing={4}>
                  <Heading
                    fontSize="3xl"
                    as="h2"
                    fontWeight={400}
                    color="blackAlpha.700"
                  >
                    "{data.text}"
                  </Heading>
                  <Text fontSize="sm" color="blackAlpha.700">
                    {data.author}
                  </Text>
                </Stack>
              </Fade>
            </Container>
          </Flex>
          <Button
            leftIcon={<IoReloadOutline />}
            colorScheme="blue"
            maxW={"50%"}
            onClick={(e) => {
              getNewQuote();
              onClose();
            }}
          >
            Load a new quote
          </Button>
        </Stack>
      );
  }
  return <Spinner color="blue.600" />;
};
