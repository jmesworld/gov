import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useIdentityserviceGetIdentityByNameQuery } from "../../client/Identityservice.react-query";
import { ProposalDaoAddMembers } from "./proposal-dao-add-members";
import { ProposalDaoRemoveMembers } from "./proposal-dao-remove-members";
import { ProposalRecipientForm } from "./proposal-recipient-form";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { DaoMultisigQueryClient } from "../../client/DaoMultisig.client";
import {
  DaoMembersClient,
  DaoMembersQueryClient,
} from "../../client/DaoMembers.client";
import {
  useDaoMembersListMembersQuery,
  useDaoMembersUpdateMembersMutation,
} from "../../client/DaoMembers.react-query";
import { useDaoMultisigListVotersQuery } from "../../client/DaoMultisig.react-query";
import { Extension, MsgExecuteContract } from "@terra-money/terra.js";
import { useWallet } from "@cosmos-kit/react";
import { ExecuteMsg } from "../../client/DaoMembers.types";
import { VoterDetail } from "../../client/DaoMultisig.types";
import { useMutation } from "@tanstack/react-query";
import { WasmMsg } from "../../client/Governance.types";
import * as DaoMultisig from "../../client/DaoMultisig.types";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export const UpdateMemberProposal = () => {
  const walletManager = useWallet();
  const { walletStatus, address } = walletManager;
  const toast = useToast();

  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [addMembers, setAddMembers] = useState(new Array<any>());
  const [isAddMembersNamesValid, setAddMembersNamesValid] = useState(false);
  const [removeMembers, setRemoveMembers] = useState(new Array<any>());
  const [isRemoveMembersNamesValid, setRemoveMembersNamesValid] =
    useState(false);
  const [daoNameUpdateMembers, setDaoNameUpdateMembers] = useState("");

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
    args: { name: daoNameUpdateMembers },
  });

  const daoMembersQueryClient = new DaoMultisigQueryClient(
    lcdClient,
    daoNameUpdateMembersQuery.data?.identity?.owner as string
  );

  const daoMembersListQuery = useDaoMultisigListVotersQuery({
    client: daoMembersQueryClient,
    args: {},
    options: {
      enabled: !!daoNameUpdateMembersQuery.data?.identity?.owner,
    },
  });

  async function updateMembers() {
    let add: any[] = [];
    let remove: any[] = [];
    let prevDaoMembers = daoMembersListQuery.data?.voters as VoterDetail[];
    let prevTotalWeight = 0;

    try {
      for (const member of removeMembers) {
        for (let i = 0; i < prevDaoMembers?.length; i++) {
          if (prevDaoMembers[i].addr === member.address) {
            remove.push({
              addr: prevDaoMembers[i].addr,
              weight: prevDaoMembers[i].weight,
            });
            prevDaoMembers.splice(i, 1);
          }
        }
      }

      for (const member of prevDaoMembers) {
        prevTotalWeight += member.weight;
      }

      for (const member of addMembers) {
        const weight = Math.ceil(
          (prevTotalWeight * member.percentage) / (100 - member.percentage)
        );
        add.push({
          addr: member.address,
          weight: weight,
        });
      }
      const daoUpdateMembersData = {
        add: add,
        remove: remove,
      };

      const contract_addr = (await daoMembersQueryClient.config())
        .dao_members_addr as string;

      const updateMembersMsg: ExecuteMsg = {
        update_members: daoUpdateMembersData,
      };

      const wasmMsg: WasmMsg = {
        execute: {
          contract_addr: contract_addr,
          funds: [],
          msg: Buffer.from(JSON.stringify(updateMembersMsg)).toString("base64"),
        },
      };

      const ext = new Extension();

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

      const dao_multisig_contract_addr = daoMembersQueryClient.contractAddress as string; 

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
        setAddMembers(new Array());
        setAddMembersNamesValid(false);
        setDaoNameUpdateMembers("");
        setProposalDesc("");
        setProposalTitle("");
        setRemoveMembers(new Array());
        setRemoveMembersNamesValid(false);
        toast({
          title: "Dao created.",
          description: "We've created your Proposal for you.",
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

  const updateMembersMutation = useMutation(
    ["updateMembersMutation"],
    updateMembers
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
        <Text marginBottom={2} fontSize={24}>
          DAO NAME
        </Text>
        <Input
          marginBottom={2}
          placeholder="Type your DAO name here"
          size="lg"
          onChange={(event) => {
            setDaoNameUpdateMembers(event.target.value.trim());
          }}
        ></Input>
        <Text marginBottom={2} fontSize={14}>
          {daoNameUpdateMembers.length > 0
            ? daoNameUpdateMembersQuery.isFetched
              ? daoNameUpdateMembersQuery?.data?.identity?.name.toString() ===
                daoNameUpdateMembers
                ? daoNameUpdateMembersQuery.data.identity.owner
                : "Dao does not exist!"
              : "Checking..."
            : ""}
        </Text>
        <Grid
          templateColumns="repeat(2, 1fr)"
          templateRows="repeat(1, 1fr)"
          marginTop={8}
        >
          <Text fontSize={24}>ADD MEMBERS</Text>
          <Flex justifyContent="end">
            <Button
              variant="outline"
              width={100}
              onClick={() => {
                setAddMembers((addMembers: string | any[]) => [
                  ...addMembers,
                  {
                    name: "",
                    id: addMembers.length + 1,
                    address: "",
                    percentage: 0,
                  },
                ]);
              }}
            >
              <Text fontSize={18} fontWeight="bold">
                +
              </Text>
            </Button>
          </Flex>
          <ProposalDaoAddMembers
            addMembers={addMembers}
            setAddMembers={setAddMembers}
            setAddMembersNamesValid={setAddMembersNamesValid}
            daoAddress={
              daoNameUpdateMembersQuery.data?.identity?.owner as string
            }
          />
        </Grid>
        <Grid
          templateColumns="repeat(2, 1fr)"
          templateRows="repeat(1, 1fr)"
          marginTop={8}
        >
          <Text fontSize={24}>REMOVE MEMBERS</Text>
          <Flex justifyContent="end">
            <Button
              variant="outline"
              width={100}
              onClick={() => {
                setRemoveMembers((removeMembers: string | any[]) => [
                  ...removeMembers,
                  {
                    name: "",
                    id: removeMembers.length + 1,
                    address: "",
                  },
                ]);
              }}
            >
              <Text fontSize={18} fontWeight="bold">
                +
              </Text>
            </Button>
          </Flex>
          <ProposalDaoRemoveMembers
            removeMembers={removeMembers}
            setRemoveMembers={setRemoveMembers}
            setRemoveMembersNamesValid={setRemoveMembersNamesValid}
            daoAddress={
              daoNameUpdateMembersQuery.data?.identity?.owner as string
            }
          />
        </Grid>
        <Flex justifyContent="center" margin={8}>
          <Button
            disabled={
              !(
                daoNameUpdateMembersQuery?.data?.identity?.name.toString() ===
                  daoNameUpdateMembers &&
                !!daoMembersListQuery.data &&
                isAddMembersNamesValid &&
                isRemoveMembersNamesValid &&
                proposalTitle.length > 2 &&
                proposalDesc.length > 2
              )
            }
            width={250}
            height={50}
            variant="outline"
            color="white"
            bgColor="primary.500"
            onClick={() => updateMembersMutation.mutate()}
          >
            {" "}
            Create DAO Proposal{" "}
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};
