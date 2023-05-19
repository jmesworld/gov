import { DAOItemProps } from "../types";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Link,
  Progress,
  ProgressLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { DaoMultisigQueryClient } from "../../client/DaoMultisig.client";
import {
  useDaoMultisigListVotersQuery,
  useDaoMultisigListVotesQuery,
} from "../../client/DaoMultisig.react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export const ProposalList = ({
  proposals,
  isGov,
  daoAddress,
}: {
  proposals: any;
  isGov: boolean;
  daoAddress?: string;
}) => {
  if (!proposals || Array.from(proposals).length === 0) {
    return (
      <Flex justifyContent="center" width="100%">
        <Text
          color="rgba(15,0,86,0.8)"
          fontFamily={"DM Sans"}
          fontWeight="normal"
          fontStyle={"italic"}
          fontSize={14}
          marginTop={"24px"}
        >
          {`There are currently no ${
            isGov ? "Governance" : "Dao"
          } Proposals available to view`}
        </Text>
      </Flex>
    );
  } else {
    const proposalItems = proposals.map((proposal: any) => {
      const yesVoters = proposal?.yes_voters?.length;
      const noVoters = proposal?.no_voters?.length;
      const totalVoters = isGov ? yesVoters + noVoters : 0;

      const propType = isGov
        ? JSON.stringify(proposal.prop_type).split(":")[0].slice(2)
        : "";
      const type = isGov
        ? propType.slice(0, propType.length - 1)
        : proposal.description;

      return (
        <ProposalListItem
          key={proposal.id + proposal.description}
          title={proposal.title}
          yesCount={yesVoters}
          noCount={noVoters}
          totalCount={totalVoters}
          threshold={proposal.threshold?.absolute_percentage?.percentage}
          type={type}
          pass={
            proposal.status === "success" ||
            proposal.status === "success_concluded"
              ? "Yes"
              : "No"
          }
          isGov={isGov}
          daoAddress={daoAddress}
          proposalId={proposal.id}
        />
      );
    });

    return <ul>{proposalItems}</ul>;
  }
};

export const ProposalHeader = ({ isGov }: { isGov: boolean }) => {
  return (
    <Flex width={"1137px"}>
      <Text
        color="rgba(15,0,86,0.8)"
        fontWeight="medium"
        fontFamily="DM Sans"
        fontSize={12}
        width={isGov ? "227px" : "151px"}
      >
        {isGov ? "GOVERNANCE PROPOSALS" : "DAO PROPOSALS"}
      </Text>
      <Text
        color="rgba(15,0,86,0.8)"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={12}
        marginLeft={isGov ? "204px" : "15.67%"}
        width={"32px"}
      >
        YES
      </Text>
      <Text
        color="rgba(15,0,86,0.8)"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={12}
        marginLeft={isGov ? "10.642%" : "10.766%"}
        width={"32px"}
      >
        NO
      </Text>
      <Text
        color="rgba(15,0,86,0.8)"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={12}
        marginLeft={isGov ? "11.522%" : "10.1675%"}
        width={"94px"}
      >
        % TO PASS
      </Text>
      <Text
        color="rgba(15,0,86,0.8)"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={12}
        marginLeft={isGov ? "16.271%" : "16.986%"}
        width={"94px"}
      >
        PASSING
      </Text>
    </Flex>
  );
};

export const ProposalListItem = ({
  title,
  yesCount,
  noCount,
  totalCount,
  threshold,
  pass,
  type,
  isGov,
  daoAddress,
  proposalId,
}: {
  title: string;
  threshold: number | undefined;
  pass: string;
  type: string;
  yesCount: number;
  noCount: number;
  totalCount: number;
  isGov: boolean;
  daoAddress?: string;
  proposalId?: string;
}) => {
  const chainContext = useChain(chainName);
  const { address, getCosmWasmClient, getSigningCosmWasmClient } = chainContext;

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };

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

  const daoQueryClient = new DaoMultisigQueryClient(
    cosmWasmClient as CosmWasmClient,
    daoAddress as string
  );

  const votesQuery = useDaoMultisigListVotesQuery({
    client: daoQueryClient,
    args: { proposalId: proposalId ? parseInt(proposalId as string) : 0 },
    options: { refetchInterval: 10 },
  });

  const votersQuery = useDaoMultisigListVotersQuery({
    client: daoQueryClient,
    args: {},
    options: { refetchInterval: 10 },
  });

  yesCount = isGov
    ? yesCount
    : !!votesQuery.data
    ? (votesQuery.data?.votes.filter(
        (vote) =>
          vote.proposal_id === parseInt(proposalId as string) &&
          vote.vote === "yes"
      )?.length as number)
    : 0;

  noCount = isGov
    ? noCount
    : !!votesQuery.data
    ? (votesQuery.data?.votes.filter(
        (vote) =>
          vote.proposal_id === parseInt(proposalId as string) &&
          vote.vote === "no"
      )?.length as number)
    : 0;

  totalCount = isGov
    ? totalCount
    : !!votersQuery.data
    ? votersQuery.data?.voters?.length
    : 0;

  const yesPercentActual = yesCount !== 0 ? yesCount / totalCount : 0;
  const noPercentActual = noCount !== 0 ? noCount / totalCount : 0;

  const yesPercent = totalCount === 0 ? 0 : Math.floor(yesPercentActual * 100);

  const yes = totalCount === 0 ? "0%" : yesPercent.toString() + "%";

  const no = totalCount === 0 ? "0%" : (100 - yesPercent).toString() + "%";

  threshold = isGov || !threshold ? 50 : threshold * 100;

  return (
    <>
      <Flex
        height={"64px"}
        width={isGov ? "1137px" : "836px"}
        backgroundColor="purple"
        borderRadius={12}
        alignItems={"center"}
      >
        <Box>
          <Flex width={"100%"}>
            <Box>
              <Text
                width={isGov ? "281px" : "268px"}
                color="white"
                fontFamily={"DM Sans"}
                fontWeight="normal"
                fontSize={18}
                marginLeft={"14px"}
              >
                {title.length > 20 ? title.substring(0, 20) + "..." : title}
              </Text>
            </Box>
            <Tooltip
              hasArrow={true}
              label={`${roundNumber(yesPercentActual * 100)}%`}
              bg={"midnight"}
              color={"white"}
              direction={"rtl"}
              placement={"right"}
              borderRadius={"8px"}
            >
              <Box>
                <Text
                  width={"60px"}
                  color="white"
                  fontFamily={"DM Sans"}
                  fontWeight="normal"
                  fontSize={18}
                  marginLeft={isGov ? "135px" : "0px"}
                >
                  {yes}
                </Text>
              </Box>
            </Tooltip>
            <Tooltip
              hasArrow={true}
              label={`${roundNumber(noPercentActual * 100)}%`}
              bg={"midnight"}
              color={"white"}
              direction={"rtl"}
              placement={"right"}
            >
              <Box>
                <Text
                  width={"60px"}
                  color="white"
                  fontFamily={"DM Sans"}
                  fontWeight="normal"
                  fontSize={18}
                  marginLeft={isGov ? "93px" : "62px"}
                >
                  {no}
                </Text>
              </Box>
            </Tooltip>
            <Box>
              <Text
                width={"87px"}
                color="white"
                fontFamily={"DM Sans"}
                fontWeight="normal"
                fontSize={18}
                marginLeft={isGov ? "103px" : "57px"}
              >
                {threshold?.toString() + "%"}
              </Text>
            </Box>
          </Flex>

          <Flex alignItems={"center"}>
            <Box>
              <Text
                width={isGov ? "281px" : "268px"}
                color="white"
                fontFamily={"DM Sans"}
                fontWeight="normal"
                fontSize={14}
                marginLeft={"14px"}
                opacity={"70%"}
              >
                {type.length > 26 ? title.substring(0, 26) + "..." : type}
              </Text>
            </Box>

            <Box
              width={"9px"}
              height={"9px"}
              backgroundColor="#68FFF1"
              marginLeft={isGov ? "135px" : "0%"}
              borderRadius={90}
            />
            <Box>
              <Text
                color="white"
                fontFamily={"DM Sans"}
                fontWeight="normal"
                fontSize={14}
                marginLeft={"6px"}
                opacity={"70%"}
                width={"65px"}
              >
                {yesCount < 99 ? `${yesCount} votes` : `99+ votes`}
              </Text>
            </Box>

            <Box
              alignSelf={"center"}
              width={"9px"}
              height={"9px"}
              backgroundColor="#FF5876"
              marginLeft={isGov ? "73px" : "42px"}
              borderRadius={90}
            />
            <Box>
              <Text
                color="white"
                fontFamily={"DM Sans"}
                fontWeight="normal"
                fontSize={14}
                marginLeft={"6px"}
                opacity={"70%"}
                width={"65px"}
                marginRight={isGov ? "82px" : "36px"}
              >
                {noCount < 99 ? `${noCount} votes` : `99+ votes`}
              </Text>
            </Box>
            <ProgressBar yesPercent={yesPercent} threshold={threshold} />
          </Flex>
        </Box>
        <Flex
          width={"64px"}
          height={"24px"}
          marginLeft={isGov ? "7.212%" : "5.383%"}
          borderRadius={"90px"}
          borderWidth={"1px"}
          borderColor={pass === "Yes" ? "green" : "red"}
          backgroundColor={"transparent"}
          justifyContent={"center"}
        >
          <Text
            color="white"
            fontWeight="normal"
            fontSize={14}
            fontFamily="DM Sans"
          >
            {pass}
          </Text>
        </Flex>
      </Flex>
      <Box height={"7px"} />
    </>
  );
};

export const ProgressBar = ({
  yesPercent,
  threshold,
}: {
  yesPercent: number;
  threshold: number;
}) => {
  return (
    <Progress
      value={yesPercent}
      backgroundColor={"#5136C2"}
      width={"191px"}
      height={"6px"}
      borderRadius={"10px"}
      variant={yesPercent <= threshold ? "red" : "green"}
    >
      <ProgressLabel marginLeft={threshold?.toString() + "%"} height={"8px"}>
        <Flex
          backgroundColor={"transparent"}
          width={"3px"}
          height={"8px"}
          alignItems={"center"}
        >
          <Box width={"1px"} height={"6px"} backgroundColor="#7453FD" />
          <Box width={"1px"} height={"8px"} backgroundColor="white" />
          <Box width={"1px"} height={"6px"} backgroundColor="#7453FD" />
        </Flex>
      </ProgressLabel>
    </Progress>
  );
};

export const roundNumber = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
