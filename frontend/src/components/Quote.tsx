import {
  Container,
  Stack,
  Text,
  Flex,
  Spinner,
  Heading,
  Fade,
  Link,
  Button,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

import { useState, useEffect } from "react";
const axios = require("axios").default;

export const Quote = () => {
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();

  const [data, setData] = useState<{ author: string; text: string }>();
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const getNewQuote = () => {
    // console.log("isOpen", isOpen);
    // if (isOpen) onToggle();
    axios
      .get("https://thequoteapi.com/api/quotes/random", {
        headers: {
          api_key:
            "live_OI2gIKEwWE0m3Yh7ScPavLVRCCtlKZgOI3EcrvTYjIVUhnnycrt18ww3KbuRhtZ1",
        },
      })
      .then((response: any) => {
        setData(response.data);
      })
      .catch((error: any) => setError(error.message))
      .finally(() => {
        setLoaded(true);
        //onToggle();
        onOpen();
        console.log("isOpen success", isOpen);
      });
  };
  //fist run

  useEffect(() => {
    if (!data) {
      getNewQuote();
      return;
    }
  }, []);

  if (loaded) {
    //if (error) return <span>Error: {error}</span>;
    if (data)
      return (
        <Flex
          align={"center"}
          justify={"center"}
          bg="whiteAlpha.900"
          rounded={"lg"}
        >
          <Container maxW={"lg"} p={6}>
            <Stack spacing={3}>
              <Fade in={isOpen}>
                <Heading
                  fontSize="5xl"
                  as="h2"
                  color={"blackAlpha.700"}
                  fontWeight={600}
                >
                  "{data.text}"
                </Heading>
                <Text fontSize="sm">{data.author}</Text>

                <Button
                  onClick={(e) => {
                    getNewQuote();
                    onClose();
                  }}
                  colorScheme="blue"
                  size="xs"
                  variant={"outline"}
                >
                  Load a new quote
                </Button>
              </Fade>
            </Stack>
          </Container>
        </Flex>
      );
  }
  return <Spinner color="blue.600" />;
};
