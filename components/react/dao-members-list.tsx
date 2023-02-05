import { Box, Divider, Text } from "@chakra-ui/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useChain } from "@cosmos-kit/react";
import { useEffect } from "react";
import { DaoMultisigQueryClient } from "../../client/DaoMultisig.client";
import { useDaoMultisigListVotersQuery } from "../../client/DaoMultisig.react-query";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../../client/Identityservice.react-query";
import { chainName } from "../../config/defaults";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

let cosmWasmClient: CosmWasmClient;

const LCDOptions = {
  URL: LCD_URL,
  chainID: CHAIN_ID,
};

export const DaoMembersList = ({ daoAddress }: { daoAddress: string }) => {
  const chainContext = useChain(chainName);
  const {
    getCosmWasmClient,
    getSigningCosmWasmClient,
  } = chainContext;

  useEffect(() => {
    const init = async () => {
      cosmWasmClient = await getCosmWasmClient();
    };
    init().catch(console.error);
  });

  const daoMultisigQueryClient = new DaoMultisigQueryClient(
    cosmWasmClient,
    daoAddress
  );

  const daoMembersListQuery = useDaoMultisigListVotersQuery({
    client: daoMultisigQueryClient,
    args: {},
  });

  return (
    <Box>
      <Text
        color="#7453FD"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={12}
      >
        DAO MEMBERS
      </Text>
      <MembersList
        members={
          !!daoMembersListQuery.data ? daoMembersListQuery.data?.voters : []
        }
      />
    </Box>
  );
};

export const MembersList = ({ members }: { members: any }) => {
  const membersList = members?.map((member: any) => {
    return <DaoMembersListItem key={member.addr} address={member.addr} />;
  });

  return <ul>{membersList}</ul>;
};

export const DaoMembersListItem = ({ address }: { address: string }) => {
  const chainContext = useChain(chainName);
  const { getCosmWasmClient, getSigningCosmWasmClient } =
    chainContext;

  useEffect(() => {
    const init = async () => {
      cosmWasmClient = await getCosmWasmClient();
    };
    init().catch(console.error);
  });

  const identityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const identityQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address },
  });

  return (
    <Box width={"230px"} paddingTop={"14px"}>
      <Text
        color="#0F0056"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={12}
      >
        {identityQuery.data?.identity?.name}
      </Text>
      <Text
        color="#0F0056"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={12}
        marginBottom={"14px"}
      >
        {`${address.slice(0, 2)}...${address.slice(
          address.length - 4,
          address.length
        )}`}
      </Text>
      <Divider borderColor={"grey"} orientation="horizontal" />
    </Box>
  );
};
