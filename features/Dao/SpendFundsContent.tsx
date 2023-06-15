import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { chainName } from "../../config/defaults";
import { useChain } from "@cosmos-kit/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import SpendDaoFundsForm from "./SpendDaoFundsForm";

const SpendFundsContent = (
  identityName: any,
  setCreateDaoSelected: Function
) => {
  const { address, getCosmWasmClient } = useChain(chainName);
  const [viewDimension, setViewDimension] = useState(Array());

  useEffect(() => {
    const { innerHeight, innerWidth } = window;
    setViewDimension([innerWidth, innerHeight]);
  }, []);

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  useEffect(() => {
    if (address) {
      getCosmWasmClient()
        .then((cosmWasmClient) => {
          if (!cosmWasmClient) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  return (
    <>
      <Flex height={"47px"} />
      <Text
        color={"darkPurple"}
        fontWeight="bold"
        fontSize={28}
        fontFamily="DM Sans"
      >
        Create DAO
      </Text>
      <Flex height={"75px"} />
      <SpendDaoFundsForm
        daoOwner={{
          name: identityName,
          address: address as string,
          votingPower: 0,
        }}
        setCreateDaoSelected={setCreateDaoSelected}
      />
    </>
  );
};

export default SpendFundsContent;
