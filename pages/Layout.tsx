import { Box, Container, Flex, Spacer } from "@chakra-ui/react";

import Head from "next/head";

import dynamic from "next/dynamic";

export default function Home() {
  const Header = dynamic(() => import("../features/Header/Header"));
  return (
    <Container
      maxW="100%"
      padding={0}
      backgroundColor={"rgba(198, 180, 252, 0.3)"}
    >
      <Head>
        <title>JMES Governance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex padding={0} width={"100vw"} height={"100vh"}>
        <Box
          width={"100%"}
          height={"100%"}
          paddingLeft={"54px"}
          paddingTop={"25px"}
          paddingRight={"54px"}
          overflowY="scroll"
        >
          <Flex width={"100%"}>
            <Spacer />
            <Header />
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}
