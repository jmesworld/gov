import { Core } from 'jmes';
import { ReactNode, createContext, useContext, useMemo } from 'react';
import { useValidators } from '../features/Delegate/hooks/useValidators';
import { Client } from 'jmes';
import { UnbondingDelegation } from 'jmes/build/Client/providers/LCDClient/core';

type Props = {
  children?: ReactNode;
};

interface ValidatorContextType {
  bondValidators: Map<string, Core.Validator> | null;
  unBondValidators: Map<string, Core.Delegation> | null;
  myUnBondings: UnbondingDelegation[] | null;

  bondValidatorsLoading: boolean;
  unBondValidatorsLoading: boolean;
  myUnBondingsLoading: boolean;

  bondValidatorsError: undefined | unknown;
  unBondValidatorsError: undefined | unknown;
  myUnBondingError: undefined | unknown;
}

const initialState: ValidatorContextType = {
  bondValidators: null,
  unBondValidators: null,
  myUnBondings: [],
  bondValidatorsLoading: false,
  unBondValidatorsLoading: false,
  myUnBondingsLoading: false,
  bondValidatorsError: undefined,
  unBondValidatorsError: undefined,
  myUnBondingError: undefined,
};

const ValidatorContext = createContext<ValidatorContextType>(initialState);

const RPC_URL = process.env.NEXT_PUBLIC_REST_URL as string;
const NEXT_PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;

export const client = new Client({
  providers: { LCDC: { chainID: NEXT_PUBLIC_CHAIN_ID, URL: RPC_URL } },
});

const ValidatorContextProvider = ({ children }: Props) => {
  const {
    bondValidators,
    unBondValidators,
    myUnBondings,

    isLoadingBondValidators,
    isLoadingMyUnBondings,
    isLoadingUnBondValidators,

    myUnBondingsError,
    bondValidatorsError,
    unBondedValidatorsError,
  } = useValidators(client);

  const bondValidatorsMap = useMemo(() => {
    if (!bondValidators) {
      return null;
    }
    return bondValidators.reduce((acc, curr) => {
      acc.set(curr.operator_address, curr);
      return acc;
    }, new Map<string, Core.Validator>());
  }, [bondValidators]);
  const unBondValidatorsMap = useMemo(() => {
    if (!unBondValidators) {
      return null;
    }
    return unBondValidators.reduce((acc, curr) => {
      acc.set(curr.validator_address, curr);
      return acc;
    }, new Map<string, Core.Delegation>());
  }, [unBondValidators]);

  const value: ValidatorContextType = {
    bondValidators: bondValidatorsMap,
    unBondValidators: unBondValidatorsMap,
    myUnBondings: myUnBondings ?? null,

    myUnBondingsLoading: isLoadingMyUnBondings,
    bondValidatorsLoading: isLoadingBondValidators,
    unBondValidatorsLoading: isLoadingUnBondValidators,

    myUnBondingError: myUnBondingsError,
    unBondValidatorsError: unBondedValidatorsError,
    bondValidatorsError: bondValidatorsError,
  };

  return (
    <ValidatorContext.Provider value={value}>
      {children}
    </ValidatorContext.Provider>
  );
};

const useValidatorContext = () => useContext(ValidatorContext);

export { useValidatorContext, ValidatorContextProvider };
