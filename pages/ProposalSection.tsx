import dynamic from "next/dynamic";
import { useState } from "react";
import useClient from "../hooks/useClient";

const DaoProposalDetail = dynamic(
  () => import("../features/Dao/components/DaoProposalDetail")
);
const GovProposalDetail = dynamic(
  () => import("../features/Governance/GovProposalDetail")
);
const GovernanceProposal = dynamic(
  () => import("../features/Governance/GovernanceProposal")
);
const CreateDao = dynamic(() => import("../features/Dao/CreateDao"));
const DaoProposal = dynamic(
  () => import("../features/Dao/components/DaoProposal")
);

const CreateGovProposal = dynamic(
  () => import("../features/Governance/CreateGovProposal")
);

const ProposalSection = () => {
  const { handleGetIdentity } = useClient();
  const identity = handleGetIdentity() as string;
  const [selectedSection, setSelectedSection] = useState<any>("govProposal");
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
            setCreateGovProposalSelected={selectedSection}
          />
        );
      case "createDao":
        return (
          <CreateDao
            setCreateDaoSelected={setSelectedSection("createDao")}
            identityName={identity}
          />
        );
      case "govProposal":
        return (
          <GovernanceProposal
            setSelectedProposalId={selectedSection.proposal_id}
            setGovProposalDetailOpen={selectedSection.govProposal_detail_open}
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

export default ProposalSection;
