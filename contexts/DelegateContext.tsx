import { ReactNode, useContext, useState, createContext } from 'react';
import { Delegate } from '../features/Delegate/delegate';

type Props = {
  children?: ReactNode;
};

const emptyFN = () => {
  throw new Error('Forgot to wrap your component with DelegateContextProvider');
};

type DelegateContextType = {
  delegateIsOpen: boolean;
  openDelegate: () => void;
  closeDelegate: () => void;
};

const inititalState: DelegateContextType = {
  delegateIsOpen: false,
  openDelegate: emptyFN,
  closeDelegate: emptyFN,
};

const DelegateContext = createContext<DelegateContextType>(inititalState);

const DelegateContextProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDelegate = () => {
    setIsOpen(true);
  };

  const closeDelegate = () => {
    setIsOpen(false);
  };

  const value = {
    delegateIsOpen: isOpen,
    openDelegate,
    closeDelegate,
  };
  return (
    <DelegateContext.Provider value={value}>
      {isOpen && <Delegate onClose={closeDelegate} />}
      {children}
    </DelegateContext.Provider>
  );
};

const useDelegateContext = () => useContext(DelegateContext);

export { DelegateContextProvider, useDelegateContext };
