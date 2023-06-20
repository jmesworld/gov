import dynamic from "next/dynamic";

const MyDaoList = dynamic(() => import("./MyDaoList"));
const DaoProposal = dynamic(() => import("./components/DaoProposal"));
const DaoMembersList = dynamic(() => import("./DaoMemberList"));
const DaoProposalDetail = dynamic(
  () => import("./components/DaoProposalDetail")
);
const DaoMemberList = dynamic(() => import("./DaoMemberList"));
const CreateDaoForm = dynamic(() => import("./CreateDaoForm"));
const SpendDaoFundsForm = dynamic(() => import("./SpendDaoFundsForm"));
const Dao = {
  MyDaoList,
  DaoProposal,
  DaoMembersList,
  DaoProposalDetail,
  DaoMemberList,
  CreateDaoForm,
  SpendDaoFundsForm,
};

export { Dao };
