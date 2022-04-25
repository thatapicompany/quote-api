import { Container, Stack, Flex, Link, Icon } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { DiGithubBadge } from "react-icons/di";

export const About = () => {
  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg="whiteAlpha.900"
      rounded={"lg"}
    >
      <Container
        maxW={"lg"}
        // bg="whiteAlpha.100"
        // boxShadow={"xl"}
        p={6}
      >
        <Stack spacing={3}>
          <Link
            color="blackAlpha.800"
            href="https://github.com/thatapicompany/quote-api"
            fontSize="md"
            target="_blank"
            rel="noopener noreferrer"
            isExternal
          >
            <Icon as={DiGithubBadge} />
            &nbsp; Clone this code <ExternalLinkIcon mx="2px" />
          </Link>
          <Link
            color="blackAlpha.800"
            href="https://thatapicompany.com/"
            fontSize="md"
            target="_blank"
            rel="noopener noreferrer"
            isExternal
          >
            Another Awesome API made by That API Company © All rights reserved{" "}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Stack>
      </Container>
    </Flex>
  );
};
