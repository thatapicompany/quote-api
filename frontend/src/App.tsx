import { ChakraProvider, VStack, Grid, Container } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import { Quote } from "./components/Quote";
import { Signup } from "./components/Signup";
import { About } from "./components/About";
import { Logo } from "./components/Logo";
import { Discord } from "./components/Discord";
import theme from "./Theme/Theme";
import "@fontsource/dancing-script";
import "@fontsource/noto-serif";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Container
      p={0}
      mb={4}
      minW="100%"
      centerContent
      textAlign="center"
      fontSize="xl"
    >
      <Grid minH="100vh" minW={"100%"} px={0}>
        <ColorModeSwitcher m={2} justifySelf="flex-end" />
        <VStack spacing={8}>
          <Logo />
          <Quote />
          <Signup />
          <About />
          <Discord />
        </VStack>
      </Grid>
    </Container>
  </ChakraProvider>
);
