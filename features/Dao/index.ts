import dynamic from "next/dynamic";

const MyDaoList = dynamic(() => import("./MyDaoList"));
const DaoProposal = dynamic(() => import("./DaoProposal"));
const DaoMembersList = dynamic(() => import("./DaoMemberList"));
const DaoProposalDetail = dynamic(() => import("./DaoProposalDetail"));
const DaoMemberList = dynamic(() => import("./DaoMemberList"));
const CreateDao = dynamic(() => import("./CreateDao"));
const CreateDaoForm = dynamic(() => import("./CreateDaoForm"));

const Dao = {
  MyDaoList,
  DaoProposal,
  DaoMembersList,
  DaoProposalDetail,
  DaoMemberList,
  CreateDao,
  CreateDaoForm,
};

export default Dao;
