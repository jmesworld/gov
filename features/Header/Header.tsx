import { Flex, Spacer } from "@chakra-ui/react";

import Wallet from "../Wallet";
import PeriodInfo from "./components/PeriodInfo";

const Header = () => {
  return (
    <Flex width={"100%"}>
      <PeriodInfo />
      <Spacer />
      <Wallet />
    </Flex>
  );
};

export default Header;
