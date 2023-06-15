import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { StdFee } from "@cosmjs/amino";
import { DaoMultisigClient } from "../../client/DaoMultisig.client";
import { useDaoMultisigProposeMutation } from "../../client/DaoMultisig.react-query";

import { ProposalType } from "../components/Proposal/ProposalType";
import { chainName } from "../../config/defaults";
import { toBase64 } from "../../utils/identity";
import * as Governance from "../../client/Governance.types";

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

const fee: StdFee = {
  amount: [{ amount: "30000", denom: "ujmes" }],
  gas: "10000000",
};

const proposalTypes = ["spend-funds"];

export default function DaoProposalPage({
  selectedDao,
  selectedDaoName,
  setCreateGovProposalSelected,
}: {
  selectedDao: string;
  selectedDaoName: string;
  setCreateGovProposalSelected: Function;
}) {
  const { address, getCosmWasmClient, getSigningCosmWasmClient } =
    useChain(chainName);

  const toast = useToast();
  const [selectedProposalType, setSelectedProposalType] = useState(
    proposalTypes[0]
  );
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [slotType, setSlotType] = useState("brand");
  const [isFundingNeeded, setFundingNeeded] = useState(false);
  const [fundingAmount, setFundingAmount] = useState(0);
  const [fundingPeriod, setFundingPeriod] = useState(0);
  const [isCreatingGovProposal, setCreatingGovProposal] = useState(false);

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);
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

      getSigningCosmWasmClient()
        .then((signingClient) => {
          if (!signingClient) {
            return;
          }
          setSigningClient(signingClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  const daoClient: DaoMultisigClient = new DaoMultisigClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    selectedDao
  );

  const createGovProposalMutation = useDaoMultisigProposeMutation();

  const isFormValid =
    proposalTitle.length > 1 && proposalDescription.length > 1;

  const ButtonSection = (
    <Flex
      marginTop={"42px"}
      marginBottom={"93px"}
      height={"48px"}
      alignItems={"center"}
      width={"874px"}
    >
      <Spacer />
      <Button
        width={"99px"}
        height={"42px"}
        variant={"link"}
        onClick={() => setCreateGovProposalSelected(false)}
      >
        <Text
          color={"darkPurple"}
          fontFamily="DM Sans"
          fontSize={14}
          fontWeight="medium"
          style={{ textDecoration: "underline" }}
        >
          Cancel
        </Text>
      </Button>
      <Box width={"12px"} />
      <Button
        disabled={!isFormValid}
        onClick={() => {
          //
          const proposalMsg = {
            propose: getProposalExecuteMsg({
              type: selectedProposalType,
              isFundingRequired: isFundingNeeded,
              amount: fundingAmount,
              duration: fundingPeriod * 30 * 24 * 60 * 60,
              title: proposalTitle,
              description: proposalDescription,
              slot: getSlot(slotType) as Governance.CoreSlot,
              revokeSlot: {
                dao: selectedDao,
                slot: getSlot(slotType) as Governance.CoreSlot,
              },
              msgs: [
                {
                  bank: {
                    send: {
                      amount: [
                        {
                          denom: "ujmes",
                          amount: "10000000",
                        },
                      ],
                      to_address: selectedDao,
                    },
                  },
                },
              ],
            }),
          };

          setCreatingGovProposal(true);
          const wasmMsg: Governance.WasmMsg = {
            execute: {
              contract_addr: NEXT_PUBLIC_GOVERNANCE_CONTRACT,
              funds: [{ amount: "10000000", denom: "ujmes" }],
              msg: toBase64(proposalMsg),
            },
          };

          createGovProposalMutation
            .mutateAsync({
              client: daoClient,
              msg: {
                title: proposalTitle,
                description: proposalDescription,
                msgs: [
                  {
                    wasm: wasmMsg,
                  },
                ],
              },
              args: {
                fee,
                funds: [{ amount: "10000000", denom: "ujmes" }],
              },
            })
            .then(() => {
              toast({
                title: "Proposal created.",
                description: "We've created your Proposal.",
                status: "success",
                duration: 9000,
                isClosable: true,
                containerStyle: {
                  backgroundColor: "darkPurple",
                  borderRadius: 12,
                },
              });
              setCreateGovProposalSelected(false);
            })
            .catch((error) => {
              toast({
                title: "Proposal creation error",
                description: error.toString(),
                status: "error",
                duration: 9000,
                isClosable: true,
                containerStyle: {
                  backgroundColor: "red",
                  borderRadius: 12,
                },
              });
            })
            .finally(() => {
              setCreatingGovProposal(false);
            });
        }}
        backgroundColor={"green"}
        borderRadius={90}
        alignContent="end"
        width={"148px"}
        height={"42px"}
        alignSelf="center"
        _hover={{ bg: "green" }}
        variant={"outline"}
        borderWidth={"1px"}
        borderColor={"rgba(0,0,0,0.1)"}
      >
        {!isCreatingGovProposal ? (
          <Text
            color="midnight"
            fontFamily={"DM Sans"}
            fontWeight="medium"
            fontSize={14}
          >
            Create
          </Text>
        ) : (
          <CircularProgress isIndeterminate size={"24px"} color="midnight" />
        )}
      </Button>
    </Flex>
  );

  const TabSelect = (
    <Box width={"220px"} marginRight={"44px"}>
      <Text
        color={"rgba(15,0,86,0.8)"}
        fontWeight="medium"
        fontSize={12}
        fontFamily="DM Sans"
        marginBottom={"17px"}
      >
        SELECT PROPOSAL TYPE
      </Text>
      {proposalTypes.map((proposalType) => (
        <ProposalType
          key={proposalType}
          type={proposalType}
          isActive={proposalType === selectedProposalType}
          onClick={() => setSelectedProposalType(proposalType)}
        />
      ))}
    </Box>
  );

  const DetailSection = (
    <Box width={"220px"} marginRight={"52px"}>
      <Text
        color={"rgba(15,0,86,0.8)"}
        fontWeight="medium"
        fontSize={12}
        fontFamily="DM Sans"
        marginBottom={"17px"}
      >
        DETAILS
      </Text>
      <Input
        variant={"outline"}
        width={"874px"}
        height={"48px"}
        borderColor={"rgba(112,79,247,0.5)"}
        background={"rgba(112,79,247,0.1)"}
        focusBorderColor="darkPurple"
        borderRadius={12}
        color={"purple"}
        onChange={(e) => setProposalTitle(e.target.value)}
        placeholder={"Title"}
      />
      <Box height={"12px"} />
      <Textarea
        variant={"outline"}
        width={"874px"}
        height={"320px"}
        borderColor={"rgba(112,79,247,0.5)"}
        background={"rgba(112,79,247,0.1)"}
        focusBorderColor="darkPurple"
        borderRadius={12}
        color={"purple"}
        onChange={(e) => setProposalDescription(e.target.value)}
        placeholder={"Description"}
      />

      {ButtonSection}
    </Box>
  );

  return (
    <>
      <Flex>
        {TabSelect}
        {DetailSection}
      </Flex>
    </>
  );
}

const getProposalExecuteMsg = ({
  type,
  title,
  description,
  slot,
  revokeSlot,
  msgs,
  isFundingRequired,
  amount,
  duration,
}: {
  type: string;
  title: string;
  description: string;
  slot?: Governance.CoreSlot;
  revokeSlot?: Governance.RevokeCoreSlot;
  msgs?: Governance.CosmosMsgForEmpty[];
  isFundingRequired?: boolean;
  amount?: number;
  duration?: number;
}) => {
  // "text", "core-slot", "revoke-core-slot", "improvement"
  let msg: Governance.ProposalMsg;
  switch (type) {
    case "text":
      msg = isFundingRequired
        ? {
            funding: {
              description: description,
              title: title,
              amount: amount?.toString() as string,
              duration: duration as number,
            },
          }
        : {
            text_proposal: {
              description: description,
              title: title,
            },
          };
      return msg;
    case "update-members":
      msg = {
        core_slot: {
          description: description,
          title: title,
          slot: slot as Governance.CoreSlot,
        },
      };
      return msg;
    case "spend_dao_funds":
      msg = {
        revoke_core_slot: {
          description: description,
          title: title,
          revoke_slot: revokeSlot as Governance.RevokeCoreSlot,
        },
      };
      return msg;
  }
};

const getSlot = (type: string) => {
  switch (type) {
    case "brand":
      return { brand: {} };
    case "creative":
      return { creative: {} };
    case "core-tech":
      return { core_tech: {} };
  }
};
