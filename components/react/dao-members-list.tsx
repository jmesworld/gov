import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useChain } from "@cosmos-kit/react";
import { useEffect } from "react";
import { DaoMultisigQueryClient } from "../../client/DaoMultisig.client";
import { useDaoMultisigListVotersQuery } from "../../client/DaoMultisig.react-query";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../../client/Identityservice.react-query";
import { chainName } from "../../config/defaults";

const tooltip_text =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

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
  const { getCosmWasmClient, getSigningCosmWasmClient } = chainContext;

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
    <Box width={"265px"}>
      <Flex>
        <Text
          color="rgba(15,0,86,0.8)"
          fontWeight="medium"
          fontSize={12}
          marginRight={"6px"}
          marginBottom={"12px"}
          fontFamily="DM Sans"
        >
          DAO MEMBERS
        </Text>
        <Tooltip
          hasArrow={true}
          label={tooltip_text}
          bg={"midnight"}
          color={"white"}
          direction={"rtl"}
          placement={"top"}
          borderRadius={"10px"}
          width={"173px"}
          height={"86px"}
        >
          <QuestionOutlineIcon
            width={"16px"}
            height={"16px"}
            color={"rgba(0,0,0,0.4)"}
          />
        </Tooltip>
      </Flex>
      <MembersList
        members={
          !!daoMembersListQuery.data ? daoMembersListQuery.data?.voters : []
        }
      />
    </Box>
  );
};

export const MembersList = ({ members }: { members: any }) => {
  const totalWeight = members?.reduce(
    (acc: any, o: any) => acc + parseInt(o.weight),
    0
  );
  const membersList = members?.map((member: any) => {
    const weight = member.weight;
    return (
      <DaoMembersListItem
        key={member.addr}
        address={member.addr}
        weightPercent={(weight / totalWeight) * 100}
      />
    );
  });

  return <ul>{membersList}</ul>;
};

export const DaoMembersListItem = ({
  address,
  weightPercent,
}: {
  address: string;
  weightPercent: any;
}) => {
  const chainContext = useChain(chainName);
  const { getCosmWasmClient, getSigningCosmWasmClient } = chainContext;

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
    <Flex
      width={"265px"}
      height={"54px"}
      marginBottom={"6px"}
      alignItems={"center"}
    >
      <Flex
        width={"100%"}
        height={"48px"}
        borderColor={"rgba(116,83,256,0.3)"}
        borderWidth={"1px"}
        borderRadius={"90px"}
        backgroundColor={"white"}
        alignItems={"center"}
        paddingLeft={"20px"}
      >
        <Text
          color="purple"
          fontWeight="medium"
          fontSize={14}
          fontFamily="DM Sans"
        >
          {identityQuery.data?.identity?.name}
        </Text>
      </Flex>
      <span
        style={{
          zIndex: 99999,
          position: "fixed",
        }}
      >
        <Flex
          width={"54px"}
          height={"54px"}
          borderColor={"rgba(116,83,256,0.3)"}
          borderWidth={"1px"}
          borderRadius={"360px"}
          backgroundColor={"white"}
          marginLeft={"211px"}
          justifyContent={"center"}
        >
          <Center>
            <CircularProgress
              value={weightPercent}
              size={"44px"}
              thickness={"8px"}
              color={"#4FD1C5"}
            >
              <CircularProgressLabel
                color="rgba(0,0,0,0.7)"
                fontWeight="medium"
                fontSize={14}
              >
                {weightPercent}%
              </CircularProgressLabel>
            </CircularProgress>
          </Center>
        </Flex>
      </span>
    </Flex>
  );
};
