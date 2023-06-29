import { useQuery } from '@tanstack/react-query';
import { Client, Mnemonic, Core } from 'jmes';
import { useCallback, useMemo, useState } from 'react';
import { useValidators } from './useValidators';
import { movingValidator } from '../lib/validateBonding';
import { useToast } from '@chakra-ui/react';
import { useIdentityContext } from '../../../contexts/IdentityContext';
import { BJMES_DENOM, JMES_DENOM } from '../../../lib/constants';
const client = new Client();
type TransferFormType = {
  jmesValue: number;
  bJmesValue: number;
  sliderValue: number;
};

type BoundingState = {
  bonding: boolean;
  delegatingToken?: boolean;
  selectedValidator: string | null;
  selectedUnBonding: string | null;
};

const totalJmes = 12;
const totalBondedJmes = 0;
const sliderValue = totalJmes / 100;

const getUnBonds = () => {
  throw new Error('not implemented');
};

export const useDelegate = () => {
  const { address } = useIdentityContext();

  const { isValidatorsLoading, validatorList } = useValidators(client);
  const toast = useToast();

  // TODO: use the new balance context
  const [transferForm, setTransferForm] = useState<TransferFormType>({
    jmesValue: totalJmes / 2,
    bJmesValue: totalBondedJmes / 2,
    sliderValue: sliderValue,
  });

  const [bondingState, setBondingState] = useState<BoundingState>({
    bonding: true,
    delegatingToken: undefined,
    selectedValidator: null,
    selectedUnBonding: null,
  });

  const { isLoading: isUnBondingsLoading, data: unBondingsData } = useQuery(
    ['getUnbounds'],
    getUnBonds,
    {
      cacheTime: 2 * 60 * 100,
      staleTime: 2 * 60 * 1000,
      retry: 3,
      onError(err) {
        console.error('Error:', err);
      },
    },
  );

  const toggleBonding = () => {
    setBondingState(p => ({
      ...p,
      bonding: !p.bonding,
    }));
  };

  const onChangeSlider = (sliderValue: number) => {
    setTransferForm(p => {
      const jmesValue = bondingState.bonding
        ? (totalJmes / 100) * (100 - sliderValue)
        : totalJmes + (totalBondedJmes / 100) * sliderValue;
      const bJmesValue = bondingState.bonding
        ? (totalJmes / 100) * sliderValue + totalBondedJmes
        : (totalBondedJmes / 100) * (100 - sliderValue);
      return {
        ...p,
        jmesValue: Number(jmesValue.toFixed(3)),
        bJmesValue: Number(bJmesValue.toFixed(3)),
        sliderValue,
      };
    });
  };

  const valueToMove = useMemo(() => {
    return bondingState.bonding
      ? transferForm.bJmesValue - totalBondedJmes
      : transferForm.jmesValue - totalBondedJmes;
  }, [bondingState.bonding, transferForm.bJmesValue, transferForm.jmesValue]);

  const bondingIsValid = useMemo(() => {
    return transferForm.jmesValue > 0 && totalJmes > 0;
  }, [transferForm.jmesValue]);

  const isMovingNotValid = useMemo(() => {
    return movingValidator({
      total: bondingState.bonding
        ? transferForm.jmesValue
        : transferForm.bJmesValue,
      current: valueToMove,
    });
  }, [
    bondingState.bonding,
    transferForm.bJmesValue,
    transferForm.jmesValue,
    valueToMove,
  ]);

  const mnemonic = useMemo(() => new Mnemonic(address), [address]);
  const wallet = useMemo(
    () => (address ? client.createWallet(mnemonic) : undefined),
    [address, mnemonic],
  );
  const account = useMemo(() => wallet?.getAccount(), [wallet]);

  const delegateTokens = useCallback(async () => {
    if (
      isMovingNotValid ||
      !bondingIsValid ||
      !address ||
      !bondingState.selectedValidator
    ) {
      toast({
        title: `Can't ${
          bondingState.bonding ? 'delegate' : 'undelegate'
        }, please fix the issues!`,
        duration: 4000,
      });
      return;
    }

    setBondingState(p => ({
      ...p,
      delegatingToken: true,
    }));
    try {
      if (bondingState.bonding) {
        await account?.delegateTokens(
          address,
          new Core.Coin(JMES_DENOM, valueToMove),
        );
        toast({
          title: 'Delegated Token ',
        });
      } else {
        await account?.undelegateTokens(
          address,
          new Core.Coin(BJMES_DENOM, valueToMove),
        );
        toast({
          title: 'Delegated Token ',
        });
      }
    } catch (err) {
      if (err instanceof Error)
        toast({
          title: err.message,
        });
    }

    setBondingState(p => ({
      ...p,
      delegatingToken: false,
    }));
  }, [
    account,
    address,
    bondingIsValid,
    bondingState.bonding,
    bondingState.selectedValidator,
    isMovingNotValid,
    toast,
    valueToMove,
  ]);

  return {
    ...transferForm,
    ...bondingState,
    setBondingState,
    bondingIsValid,
    setTransferForm,
    isValidatorsLoading,
    validatorList,
    isUnBondingsLoading,
    unBondingsData,
    toggleBonding,
    onChangeSlider,
    valueToMove,
    isMovingNotValid,
    delegateTokens,
  };
};
