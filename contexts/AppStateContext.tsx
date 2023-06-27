import React from "react";
import { ReactNode, createContext, useContext, useState } from "react";

interface AppState {
  isConnectButtonClicked: boolean;
  isGovProposalSelected: boolean;
  isCreateDaoSelected: boolean;
  selectedDao: string;
  selectedDaoName: string;
  isCreateGovProposalSelected: boolean;
  selectedDaoProposalTitle: string;
  selectedDaoMembersList: any[];
  isDaoProposalDetailOpen: boolean;
  isGovProposalDetailOpen: boolean;
  selectedProposalId: number;
  setConnectButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGovProposalSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateDaoSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDao: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDaoName: React.Dispatch<React.SetStateAction<string>>;
  setCreateGovProposalSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDaoProposalTitle: (value: string) => void;
  setSelectedDaoMembersList: (value: any[]) => void;
  setDaoProposalDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGovProposalDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProposalId: (value: number) => void;
}

const AppStateContext = createContext<AppState>({
  isConnectButtonClicked: false,
  isGovProposalSelected: true,
  isCreateDaoSelected: false,
  selectedDao: "",
  selectedDaoName: "",
  isCreateGovProposalSelected: false,
  selectedDaoProposalTitle: "",
  selectedDaoMembersList: [],
  isDaoProposalDetailOpen: false,
  isGovProposalDetailOpen: false,
  selectedProposalId: -1,
  setConnectButtonClicked: () => {},
  setIsGovProposalSelected: () => {},
  setCreateDaoSelected: () => {},
  setSelectedDao: () => {},
  setSelectedDaoName: () => {},
  setCreateGovProposalSelected: () => {},
  setSelectedDaoProposalTitle: () => {},
  setSelectedDaoMembersList: () => {},
  setDaoProposalDetailOpen: () => {},
  setGovProposalDetailOpen: () => {},
  setSelectedProposalId: () => {},
});

type AppStateProviderProps = {
  children: ReactNode;
};

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [isConnectButtonClicked, setConnectButtonClicked] = useState(false);
  const [isGovProposalSelected, setIsGovProposalSelected] = useState(true);
  const [isCreateDaoSelected, setCreateDaoSelected] = useState(false);
  const [selectedDao, setSelectedDao] = useState("");
  const [selectedDaoName, setSelectedDaoName] = useState("");
  const [isCreateGovProposalSelected, setCreateGovProposalSelected] =
    useState(false);
  const [selectedDaoProposalTitle, setSelectedDaoProposalTitle] = useState("");
  const [selectedDaoMembersList, setSelectedDaoMembersList] = useState<any[]>(
    []
  );
  const [isDaoProposalDetailOpen, setDaoProposalDetailOpen] = useState(false);
  const [isGovProposalDetailOpen, setGovProposalDetailOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(-1);
  

  const value: AppState = {
    isConnectButtonClicked,
    isGovProposalSelected,
    isCreateDaoSelected,
    selectedDao,
    selectedDaoName,
    isCreateGovProposalSelected,
    selectedDaoProposalTitle,
    selectedDaoMembersList,
    isDaoProposalDetailOpen,
    isGovProposalDetailOpen,
    selectedProposalId,
    setConnectButtonClicked,
    setIsGovProposalSelected,
    setCreateDaoSelected,
    setSelectedDao,
    setSelectedDaoName,
    setCreateGovProposalSelected,
    setSelectedDaoProposalTitle,
    setSelectedDaoMembersList,
    setDaoProposalDetailOpen,
    setGovProposalDetailOpen,
    setSelectedProposalId,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = React.useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
