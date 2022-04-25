import * as React from "react";
import { Text } from "@chakra-ui/react";

export const Logo = () => {
  return (
    <>
      <Text fontSize="6xl" fontWeight="bold" color={"blue.500"} as="h1">
        The Quote API
      </Text>
      <Text fontSize="md">
        Use the Quote API to get random Quotes by famous Authors, Philosphers,
        Artists, or Movies. You can even upload your own!
      </Text>
    </>
  );
};
