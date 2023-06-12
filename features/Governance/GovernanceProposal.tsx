import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GovernanceQueryClient } from "../../client/Governance.client";
import { useGovernanceProposalsQuery } from "../../client/Governance.react-query";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../../client/Identityservice.react-query";

import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useChain } from "@cosmos-kit/react";

import { chainName } from "../../config/defaults";
import GovHeader from "./GovHeader";
import { ProposalHeader } from "../components/Proposal/ProposalHeader";
import { ProposalList } from "../components/Proposal/ProposalList";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function GovernanceProposal({
  setSelectedProposalId,
  setGovProposalDetailOpen,
}: {
  setSelectedProposalId: Function;
  setGovProposalDetailOpen: Function;
}) {
  const { address, status, getCosmWasmClient } = useChain(chainName);

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

  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );
  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(
      cosmWasmClient as CosmWasmClient,
      IDENTITY_SERVICE_CONTRACT
    );

  const args = { owner: address ? address : "" };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client,
    args,
  });

  const governanceProposalQuery = useGovernanceProposalsQuery({
    client: governanceQueryClient,
    args: {},
    options: {
      refetchInterval: 10,
    },
  });

  return (
    <>
      <Flex height={"35px"} />
      <GovHeader />
      <Flex height={"46px"} />
      <ProposalHeader isGov={true} />
      <Flex height={"10px"} />

      <ProposalList
        proposals={governanceProposalQuery?.data?.proposals}
        isGov={true}
        onClickListItem={(e) => {
          setGovProposalDetailOpen(true);
        }}
        setSelectedDaoProposalTitle={() => {}}
        setSelectedProposalId={setSelectedProposalId}
      />
    </>
  );
}
