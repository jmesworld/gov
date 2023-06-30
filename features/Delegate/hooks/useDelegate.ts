import { useQuery } from '@tanstack/react-query';
import { Client, Mnemonic, Core } from 'jmes';
import { useCallback, useMemo, useState } from 'react';
import { useValidators } from './useValidators';
import { movingValidator } from '../lib/validateBonding';
import { useToast } from '@chakra-ui/react';
import { useIdentityContext } from '../../../contexts/IdentityContext';
import { BJMES_DENOM, JMES_DENOM } from '../../../lib/constants';
import { useBalanceContext } from '../../../contexts/balanceContext';
const LCD_URL = process.env.NEXT_PUBLIC_REST_URL_KEPLR as string;
const NEXT_PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;

const client = new Client({ providers: { LCDC: { chainID: NEXT_PUBLIC_CHAIN_ID, URL: LCD_URL } } });

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

const getUnBonds = () => {
  throw new Error('not implemented');
};
const sliderDefaultValue = 0;
export const useDelegate = () => {
  const { balance } = useBalanceContext();
  const totalJmes = useMemo(() => balance?.unstaked ?? 0, [balance?.unstaked]);
  const totalBondedJmes = useMemo(
    () => balance?.staked ?? 0,
    [balance?.staked],
  );

  const { address } = useIdentityContext();

  const { isValidatorsLoading, validatorList } = useValidators(client);
  const toast = useToast();

  // TODO: use the new balance context
  const [transferForm, setTransferForm] = useState<TransferFormType>({
    jmesValue: totalJmes / 2,
    bJmesValue: totalBondedJmes / 2,
    sliderValue: sliderDefaultValue,
  });
  const { jmesValue, bJmesValue } = transferForm;

  const [bondingState, setBondingState] = useState<BoundingState>({
    bonding: true,
    delegatingToken: undefined,
    selectedValidator: null,
    selectedUnBonding: null,
  });
  const { bonding, selectedValidator } = bondingState;
  const { isLoading: isUnBondingsLoading, data: unBondingsData } = useQuery(
    ['getUnBonds'],
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
      const jmesValue = bonding
        ? (totalJmes / 100) * (100 - sliderValue)
        : totalJmes + (totalBondedJmes / 100) * sliderValue;
      const bJmesValue = bonding
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
    return bonding ? bJmesValue - totalBondedJmes : jmesValue - totalBondedJmes;
  }, [bonding, totalBondedJmes, bJmesValue, jmesValue]);

  const bondingIsValid = useMemo(() => {
    return jmesValue > 0 && totalJmes > 0;
  }, [totalJmes, jmesValue]);

  const isMovingNotValid = useMemo(() => {
    return movingValidator({
      total: bonding ? totalJmes : totalBondedJmes,
      current: bonding ? jmesValue : bJmesValue,
      transfer: valueToMove,
    });
  }, [bonding, totalBondedJmes, totalJmes, bJmesValue, jmesValue, valueToMove]);

  const mnemonic = useMemo(() => new Mnemonic(address), [address]);
  const wallet = useMemo(
    () => (address ? client.createWallet(mnemonic) : undefined),
    [address, mnemonic],
  );
  const account = useMemo(() => wallet?.getAccount(), [wallet]);

  const delegateTokens = useCallback(async () => {
    if (isMovingNotValid || !bondingIsValid || !address || !selectedValidator) {
      toast({
        title: `Can't ${bonding ? 'delegate' : 'undelegate'
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
      if (bonding) {
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
    bonding,
    selectedValidator,
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
