import { Container, Stack, Text, Flex, Spinner } from "@chakra-ui/react";

import { useState, useEffect } from "react";
const axios = require("axios").default;

export const Quote = () => {
  const [data, setData] = useState<{ author: string; text: string }>();
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("https://thequoteapi.com/api/quotes/random", {
          headers: {
            api_key:
              "live_OI2gIKEwWE0m3Yh7ScPavLVRCCtlKZgOI3EcrvTYjIVUhnnycrt18ww3KbuRhtZ1",
          },
        })
        .then((response: any) => setData(response.data))
        .catch((error: any) => setError(error.message))
        .finally(() => setLoaded(true));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loaded) {
    if (error) return <span>Error: {error}</span>;
    if (data)
      return (
        <Flex align={"center"} justify={"center"} bg="whiteAlpha.100">
          <Container
            maxW={"lg"}
            bg="whiteAlpha.100"
            //boxShadow={"xl"}
            rounded={"lg"}
            p={6}
          >
            <Stack spacing={3}>
              <Text fontSize="2xl" as="i">
                "{data.text}"
              </Text>
              <Text fontSize="sm">{data.author}</Text>
            </Stack>
          </Container>
        </Flex>
      );
  }
  return <Spinner color="blue.600" />;
};
