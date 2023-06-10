import { Flex, Spacer } from "@chakra-ui/react";
import PeriodInfo from "../../components/PeriodInfo";
import Wallet from "../Wallet";

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
