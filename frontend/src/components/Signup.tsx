import { FormEvent, ChangeEvent, useState } from "react";
import {
  Stack,
  FormControl,
  Input,
  Button,
  useColorModeValue,
  Heading,
  Text,
  Container,
  Flex,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import emailRegex from "email-regex";
const axios = require("axios").default;

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"initial" | "submitting" | "success">(
    "initial"
  );
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const sendForm = () => {
    //test email
    if (!emailRegex().test(email)) {
      setError(true);
      setState("initial");
      return;
    }

    axios
      .get(
        "https://thequoteapi.com/api/signup?email=" + encodeURIComponent(email)
      )
      .then((response: any) => setState("success"))
      .catch((error: any) => {
        setState("initial");
        setError(true);
        setErrorMessage(error);
      })
      .finally(() => setState("success"));
  };
  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Container
        maxW={"lg"}
        bg={useColorModeValue("white", "whiteAlpha.100")}
        boxShadow={"xl"}
        rounded={"lg"}
        p={6}
      >
        <Text
          as={"h2"}
          fontSize={{ base: "xl", sm: "1xl" }}
          textAlign={"center"}
          mb={5}
        >
          Enter your email address to receive your API Key
        </Text>
        <Stack
          direction={{ base: "column", md: "row" }}
          as={"form"}
          spacing={"12px"}
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            setError(false);
            setState("submitting");
            sendForm();
          }}
        >
          <FormControl>
            <Input
              variant={"solid"}
              borderWidth={1}
              color={"gray.800"}
              _placeholder={{
                color: "gray.400",
              }}
              borderColor={useColorModeValue("gray.300", "gray.700")}
              id={"email"}
              type={"email"}
              required
              placeholder={"Your Email"}
              aria-label={"Your Email"}
              value={email}
              disabled={state !== "initial"}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </FormControl>
          <FormControl w={{ base: "100%", md: "40%" }}>
            <Button
              colorScheme={state === "success" ? "green" : "blue"}
              isLoading={state === "submitting"}
              w="100%"
              type={state === "success" ? "button" : "submit"}
              isDisabled={state === "success"}
            >
              {state === "success" ? <CheckIcon /> : "Submit"}
            </Button>
          </FormControl>
        </Stack>
        {state === "success" && (
          <Text>Check your email inbox for your key.</Text>
        )}
        <Text
          mt={2}
          textAlign={"center"}
          fontSize="sm"
          color={error ? "red.500" : "gray.500"}
        >
          {error
            ? "Oh no an error occured! 😢 Please try again later."
            : "You won't receive any spam! ✌️"}
          {errorMessage && "{errorMessage}"}
        </Text>
      </Container>
    </Flex>
  );
};
