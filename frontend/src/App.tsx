import { ChakraProvider, Box, VStack, Grid } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import { Quote } from "./components/Quote";
import { Signup } from "./components/Signup";
import { About } from "./components/About";
import { Logo } from "./components/Logo";
import theme from "./Theme/Theme";
import "@fontsource/dancing-script";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Logo />
          <Quote />
          <Signup />
          <About />
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
);
