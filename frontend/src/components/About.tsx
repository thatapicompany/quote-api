import {
  Container,
  Stack,
  Flex,
  Link,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { DiGithubBadge } from "react-icons/di";

export const About = () => {
  return (
    <Flex align={"center"} justify={"center"} minW={"99%"} p={6}>
      <Container p={6}>
        <Stack spacing={3}>
          <Link
            color={useColorModeValue("blackAlpha.800", "whiteAlpha.800")}
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
            color={useColorModeValue("blackAlpha.800", "whiteAlpha.800")}
            href="https://theauthapi.com/"
            fontSize="md"
            target="_blank"
            rel="noopener noreferrer"
            isExternal
          >
            Powered by The Auth API - API token management platform.
            <ExternalLinkIcon mx="2px" />
          </Link>
          <Link
            color={useColorModeValue("blackAlpha.800", "whiteAlpha.800")}
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
