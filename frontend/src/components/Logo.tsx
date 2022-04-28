import * as React from "react";
import { Text, Container, Heading, Stack } from "@chakra-ui/react";

export const Logo = () => {
  return (
    <Stack spacing={2} px={8}>
      <Heading fontSize="6xl" fontWeight="bold" color={"blue.500"} as="h1">
        The Quote API
      </Heading>
      <Text fontSize="1xl" as="h4">
        Use the Quote API to get random Quotes by famous Authors, Philosphers,
        Artists, or Movies.
      </Text>
      <Text fontSize="1xl" as="h4">
        You can even upload your own!
      </Text>
    </Stack>
  );
};
