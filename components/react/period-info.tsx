import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  Text,
  Button,
  Image,
  VStack,
  MenuList,
  MenuItem,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { useGovernancePeriodInfoQuery } from "../../client/Governance.react-query";
import { timestampToDateTime, timestampToDaysLeft } from "../../utils/time";
import { chainName } from "../../config/defaults";
import { WalletStatus } from "@cosmos-kit/core";
import { useEffect, useState } from "react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GovernanceQueryClient } from "../../client/Governance.client";

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function PeriodInfo() {
  const { getCosmWasmClient } = useChain(chainName);
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  useEffect(() => {
    getCosmWasmClient()
      .then((cosmWasmClient) => {
        if (!cosmWasmClient) {
          return;
        }
        setCosmWasmClient(cosmWasmClient);
      })
      .catch((error) => console.log(error));
  }, [getCosmWasmClient]);

  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );

  const periodInfoQuery = useGovernancePeriodInfoQuery({
    client: governanceQueryClient,
    options: {
      refetchInterval: 10,
    },
  });
  const { data } = periodInfoQuery;
  const current_period = data?.current_period;
  const next_voting_start = data?.next_voting_start;
  const next_posting_start = data?.next_posting_start;
  const current_block = data?.current_block;
  const current_posting_start = data?.current_posting_start;
  const current_time_in_cycle = data?.current_time_in_cycle;
  const current_voting_start = data?.current_voting_start;
  const current_voting_end = data?.current_voting_end;
  const cycle_length = data?.cycle_length;
  const posting_period_length = data?.posting_period_length;
  const voting_period_length = data?.voting_period_length;

  const next_period_start: number = (
    current_period === "posting" ? next_posting_start : next_voting_start
  ) as number;

  const next_period_start_in_days: string =
    timestampToDaysLeft(next_period_start);

  return !!periodInfoQuery?.data ? (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            disabled={!periodInfoQuery?.data}
            as={Button}
            rightIcon={
              isOpen ? (
                <ChevronUpIcon
                  alignSelf={"center"}
                  width={"24px"}
                  height={"24px"}
                  color={current_period === "posting" ? "purple" : "lilac"}
                />
              ) : (
                <ChevronDownIcon
                  alignSelf={"center"}
                  width={"24px"}
                  height={"24px"}
                  color={current_period === "posting" ? "purple" : "lilac"}
                />
              )
            }
            width={"373px"}
            height={"48px"}
            _hover={{
              bg: current_period === "posting" ? "lightLilac" : "darkPurple",
            }}
            _expanded={{
              bg: current_period === "posting" ? "lightLilac" : "darkPurple",
            }}
            backgroundColor={
              current_period === "posting" ? "lightLilac" : "darkPurple"
            }
            borderColor={current_period === "posting" ? "purple" : "lightLilac"}
            variant={"outline"}
            borderWidth={"1px"}
            borderRadius={"90px"}
          >
            <Flex alignItems={"center"}>
              <Image
                src={
                  current_period === "posting"
                    ? "/Posting_Period.svg"
                    : "/Voting_Period.svg"
                }
                alt="Perod Icon"
                width={"22px"}
                height={"22px"}
              />
              <Flex alignItems={"center"} width={"100%"} paddingLeft={"8px"}>
                <Text
                  fontWeight={"bold"}
                  fontSize={"14"}
                  fontFamily="DM Sans"
                  color={current_period === "posting" ? "darkPurple" : "green"}
                  paddingRight={"10px"}
                >
                  Current cycle:{" "}
                  {!!periodInfoQuery?.data
                    ? (((current_period?.charAt(0).toUpperCase() as string) +
                        current_period?.slice(1)) as string)
                    : ""}
                </Text>
                <Divider
                  orientation="vertical"
                  height={22}
                  p={0}
                  borderColor={
                    current_period === "posting" ? "darkPurple" : "lilac"
                  }
                />
                <Text
                  fontWeight={"normal"}
                  fontSize={"14"}
                  fontFamily="DM Sans"
                  color={current_period === "posting" ? "midnight" : "lilac"}
                  paddingLeft={"10px"}
                >
                  {!!periodInfoQuery?.data
                    ? `${next_period_start_in_days} remaining`
                    : ""}
                </Text>
              </Flex>
            </Flex>
          </MenuButton>
          <MenuList
            backgroundColor={
              current_period === "posting" ? "lightLilac" : "darkPurple"
            }
            borderColor={current_period === "posting" ? "purple" : "lightLilac"}
            borderWidth={1}
            width={"373px"}
            height={"341px"}
            px={"18px"}
            borderRadius={"12px"}
          >
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Block
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {current_block}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Period
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {
                  ((current_period?.charAt(0).toUpperCase() as string) +
                    current_period?.slice(1)) as string
                }
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Posting Start
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime(current_posting_start as number)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Time in Cycle
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {current_time_in_cycle}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Voting Start
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime(current_voting_start as number)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Voting End
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime(current_voting_end as number)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Cycle Length
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {cycle_length}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Next Posting Start
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime(next_posting_start as number)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Next Voting Start
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime(next_voting_start as number)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Posting Period Length
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {posting_period_length}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === "posting"
                  ? "rgba(81,54,194,0.1)"
                  : "rgba(198,180,252,0.2)"
              }
            />
            <Flex width={"100%"} py={"5.3px"}>
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Voting Posting Length
              </Text>
              <Spacer />
              <Text
                color={current_period === "posting" ? "darkPurple" : "white"}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {voting_period_length}
              </Text>
            </Flex>
          </MenuList>
        </>
      )}
    </Menu>
  ) : (
    <></>
  );
}