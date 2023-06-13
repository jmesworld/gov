import dynamic from "next/dynamic";
import { useState } from "react";

const DaoProposalDetail = dynamic(
  () => import("../features/Dao/DaoProposalDetail")
);
const GovProposalDetail = dynamic(
  () => import("../features/Governance/GovProposalDetail")
);
const GovernanceProposal = dynamic(
  () => import("../features/Governance/GovernanceProposal")
);
const CreateDao = dynamic(() => import("../features/Dao/CreateDao"));
const DaoProposal = dynamic(() => import("../features/Dao/DaoProposal"));
const CreateGovProposal = dynamic(
  () => import("../features/Governance/CreateGovProposal")
);
import useClient from "../hooks/useClient";

export const ProposalSection = (
  setSelectedSection: any,
  selectedSection: any
) => {
  const { data } = useClient();
  const renderSelectedSection = () => {
    switch (selectedSection) {
      case "govProposalDetail":
        return <GovProposalDetail proposalId={0} />;
      case "daoProposalDetail":
        return (
          <DaoProposalDetail
            selectedDao={selectedSection}
            selectedDaoName={selectedSection.daoName}
            selectedDaoProposalTitle={selectedSection.proposalTitle}
            selectedDaoMembersList={selectedSection.DaoMembersList}
            selectedDaoProposalId={selectedSection.proposal_id}
          />
        );
      case "createGovProposal":
        return (
          <CreateGovProposal
            selectedDao={selectedSection}
            selectedDaoName={selectedSection}
            setCreateGovProposalSelected={setSelectedSection(
              "createGovProposal"
            )}
          />
        );
      case "createDao":
        return (
          <CreateDao
            setCreateDaoSelected={setSelectedSection("createDao")}
            identityName={data.identityName}
          />
        );
      case "govProposal":
        return (
          <GovernanceProposal
            setSelectedProposalId={selectedSection.proposal_id}
            setGovProposalDetailOpen={setSelectedSection("govProposalDetail")}
          />
        );
      default:
        return (
          <DaoProposal
            daoAddress={selectedSection.daoAddress}
            daoName={selectedSection.daoAddress}
            setDaoProposalDetailOpen={selectedSection}
            setSelectedDaoProposalTitle={selectedSection.daoName}
            setSelectedDaoMembersList={selectedSection.DaoMembersList}
            setSelectedProposalId={selectedSection.proposalId}
          />
        );
    }
  };

  return <>{renderSelectedSection()}</>;
};
