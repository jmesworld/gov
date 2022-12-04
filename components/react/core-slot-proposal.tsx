import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { Extension, MsgExecuteContract } from "@terra-money/terra.js";
import { useWallet } from "@cosmos-kit/react";
import {
  Coin,
  CoreSlot,
  ExecuteMsg,
  WasmMsg,
} from "../../client/Governance.types";
import * as DaoMultisig from "../../client/DaoMultisig.types";
import { useMutation } from "@tanstack/react-query";
import { DaoMultisigQueryClient } from "../../client/DaoMultisig.client";
import { useIdentityserviceGetIdentityByNameQuery } from "../../client/Identityservice.react-query";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export const CoreSlotProposal = ({ daoName }: { daoName: string }) => {
  const walletManager = useWallet();
  const { walletStatus, address } = walletManager;
  const toast = useToast();

  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [coreSlotOption, setCoreSlotOption] = useState("0");

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };
  const lcdClient = new LCDClient(LCDOptions);
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    lcdClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const daoNameUpdateMembersQuery = useIdentityserviceGetIdentityByNameQuery({
    client,
    args: { name: daoName },
  });

  const daoMembersQueryClient = new DaoMultisigQueryClient(
    lcdClient,
    daoNameUpdateMembersQuery.data?.identity?.owner as string
  );

  async function createCoreSlotProposal() {
    try {
      const slots: CoreSlot[] = [
        { brand: {} },
        { core_tech: {} },
        { creative: {} },
      ];

      const slot: CoreSlot = slots.at(parseInt(coreSlotOption)) as CoreSlot;

      const proposalMsg: ExecuteMsg = {
        propose: {
          core_slot: {
            title: proposalTitle,
            description: proposalDesc,
            slot,
          },
        },
      };

      const deposit: Coin = { denom: "uluna", amount: "1000" };

      const wasmMsg: WasmMsg = {
        execute: {
          contract_addr: NEXT_PUBLIC_GOVERNANCE_CONTRACT,
          funds: [deposit],
          msg: Buffer.from(JSON.stringify(proposalMsg)).toString("base64"),
        },
      };

      const msg: DaoMultisig.ExecuteMsg = {
        propose: {
          title: proposalTitle,
          description: proposalDesc,
          msgs: [
            {
              wasm: wasmMsg,
            },
          ],
        },
      };

      const dao_multisig_contract_addr =
        daoMembersQueryClient.contractAddress as string;

      const ext = new Extension();
      const execMsg = new MsgExecuteContract(
        address as string,
        dao_multisig_contract_addr,
        msg
      );
      const txMsg = {
        msgs: [execMsg.toJSON(false)],
      };

      const result = await ext.request(
        "post",
        JSON.parse(JSON.stringify(txMsg))
      );
      const payload = JSON.parse(JSON.stringify(result.payload));
      if (payload.success) {
        setProposalDesc("");
        setProposalTitle("");
        toast({
          title: "Core slot proposal created.",
          description: "We've created your Core slot Proposal for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Proposal creation error.",
          description: payload.error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const coreSlotProposalMutation = useMutation(
    ["coreSlotProposalMutation"],
    createCoreSlotProposal
  );

  return (
    <Container>
      <Box>
        <Text marginBottom={2} fontSize={24}>
          PROPOSAL TITLE
        </Text>
        <Input
          marginBottom={4}
          placeholder="Type your Proposal name here"
          size="lg"
          onChange={(event) => {
            setProposalTitle(event.target.value.trim());
          }}
        ></Input>
        <Text marginBottom={2} fontSize={24}>
          DESCRIPTION
        </Text>
        <Textarea
          marginBottom={2}
          placeholder="Enter your description here"
          size="lg"
          onChange={(event) => {
            setProposalDesc(event.target.value.trim());
          }}
        ></Textarea>
        <RadioGroup onChange={setCoreSlotOption} value={coreSlotOption}>
          <Stack direction="row">
            <Radio value="0">Brand</Radio>
            <Radio value="1">Core Tech</Radio>
            <Radio value="2">Creative</Radio>
          </Stack>
        </RadioGroup>

        <Flex justifyContent="center" margin={8}>
          <Button
            disabled={!(proposalTitle.length > 2 && proposalDesc.length > 2)}
            width={250}
            height={50}
            variant="outline"
            color="white"
            bgColor="primary.500"
            onClick={() => coreSlotProposalMutation.mutate()}
            _hover={{bg:"primary.500"}}
          >
            {" "}
            Create Core Slot Proposal{" "}
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};
