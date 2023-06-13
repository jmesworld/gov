import { useState } from "react";
import { Container, Flex, Spacer, Box } from "@chakra-ui/react";
import Head from "next/head";
import { Header, NavBar } from "../features";
import useClient from "../hooks/useClient";
import { ProposalSection } from "./ProposalSection";
import Home from "./index-copy";
export default function Content() {
  const [selectedSection, setSelectedSection] = useState("govProposal");
  const { data } = useClient();
  return <Home />;
  // return (
  //   <Container
  //     maxW="100%"
  //     padding={0}
  //     backgroundColor={"rgba(198, 180, 252, 0.3)"}
  //   >
  //     <Head>
  //       <title>JMES Governance</title>
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>
  //     <Flex padding={0} width={"100vw"} height={"100vh"}>
  //       <NavBar
  //         data={data}
  //         setSelectedSection={setSelectedSection}
  //         selectedSection={selectedSection}
  //       />
  //       <Box
  //         width={"100%"}
  //         height={"100%"}
  //         paddingLeft={"54px"}
  //         paddingTop={"25px"}
  //         paddingRight={"54px"}
  //         overflowY="scroll"
  //       >
  //         <Flex width={"100%"}>
  //           <Spacer />
  //           <Header />
  //         </Flex>
  //         <ProposalSection
  //           selectedSection={selectedSection}
  //           setSelectedSection={setSelectedSection}
  //         />
  //       </Box>
  //     </Flex>
  //   </Container>
  // );
}
