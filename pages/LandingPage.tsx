import { Box, Flex, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GovHeader, JMESLogo } from "../components";
import { ConnectWalletSection } from "../components/react/connect-wallet-section";
import { CreateIdentitySection } from "../components/react/create-identity-section";

export default function LandingPage() {
  const [viewDimension, setViewDimension] = useState(Array());

  useEffect(() => {
    const { innerHeight, innerWidth } = window;
    setViewDimension([innerWidth, innerHeight]);
  }, []);

  return (
    <Flex padding={0} width={viewDimension[0]} height={viewDimension[1]}>
      <Box
        width={"200px"}
        height={"100%"}
        backgroundColor={"#7453FD"}
        paddingTop={"30px"}
        paddingLeft={"26px"}
      >
        <JMESLogo />
      </Box>
      <Box
        width={"100%"}
        height={"100%"}
        backgroundColor={"rgba(198, 180, 252, 0.3)"}
        paddingLeft={"54px"}
        paddingTop={"90px"}
        overflowY="scroll"
      >
        <GovHeader />
        <Flex height={"74px"} />
        <ConnectWalletSection />
        <Flex height={"26px"} />
        <CreateIdentitySection />
      </Box>
    </Flex>
  );
}
