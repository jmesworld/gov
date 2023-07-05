import { Client } from 'jmes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useValidators } from './useValidators';
import { movingValidator } from '../lib/validateBonding';
import { useToast } from '@chakra-ui/react';
import { useIdentityContext } from '../../../contexts/IdentityContext';
import { BJMES_DENOM, JMES_DENOM } from '../../../lib/constants';
import { useBalanceContext } from '../../../contexts/balanceContext';
import { useSigningCosmWasmClientContext } from '../../../contexts/SigningCosmWasmClient';
import { coin } from '@cosmjs/amino';

const LCD_URL = process.env.NEXT_PUBLIC_REST_URL as string;
const NEXT_PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;

const client = new Client({
  providers: { LCDC: { chainID: NEXT_PUBLIC_CHAIN_ID, URL: LCD_URL } },
});

type TransferFormType = {
  jmesValue: number;
  bJmesValue: number;
  sliderValue: number;
  valueToMove: number;
};

type BondingState = {
  bonding: boolean;
  delegatingToken?: boolean;
  selectedValidator: string | null;
  selectedUnBonding: string | null;
};

const sliderDefaultValue = 0;
export const useDelegate = () => {
  const { signingCosmWasmClient } = useSigningCosmWasmClientContext();
  const { balance, refresh } = useBalanceContext();
  const totalJmes = useMemo(
    () => Number(balance?.unstaked.toFixed(0) ?? 0),
    [balance?.unstaked],
  );
  const totalBondedJmes = useMemo(
    () => Number(balance?.staked.toFixed(0) ?? 0),
    [balance?.staked],
  );

  const { address } = useIdentityContext();

  const {
    isValidatorsLoading,
    validatorsError,
    bondedValidatorsError,
    validatorList,
    isBondedValidatorsLoading,
    bondedValidators,
    unBondingsData,
    unBondingsError,
    isLoadingUnBondings,
  } = useValidators(client);
  const toast = useToast();

  const [transferForm, setTransferForm] = useState<TransferFormType>({
    jmesValue: Number(totalJmes.toFixed(0)),
    bJmesValue: Number(totalBondedJmes.toFixed(0)),
    valueToMove: 0,
    sliderValue: sliderDefaultValue,
  });
  const { jmesValue, bJmesValue, valueToMove } = transferForm;

  const [bondingState, setBondingState] = useState<BondingState>({
    bonding: true,
    delegatingToken: undefined,
    selectedValidator: null,
    selectedUnBonding: null,
  });
  const { bonding, selectedValidator, selectedUnBonding } = bondingState;

  const toggleBonding = () => {
    setBondingState(p => ({
      ...p,
      bonding: !p.bonding,
    }));
  };

  useEffect(() => {
    setTransferForm(p => {
      const { sliderValue } = p;
      const jmesValue = bonding
        ? (totalJmes / 100) * (100 - sliderValue)
        : totalJmes + (totalBondedJmes / 100) * sliderValue;
      const bJmesValue = bonding
        ? (totalJmes / 100) * sliderValue + totalBondedJmes
        : (totalBondedJmes / 100) * (100 - sliderValue);
      const value = bonding
        ? bJmesValue - totalBondedJmes
        : jmesValue - totalJmes;
      return {
        ...p,
        jmesValue: Number(jmesValue.toFixed(0)),
        bJmesValue: Number(bJmesValue.toFixed(0)),
        valueToMove: Number(value.toFixed(0)),
        sliderValue,
      };
    });
  }, [bonding, totalBondedJmes, totalJmes]);

  const onChangeSlider = (sliderValue: number) => {
    setTransferForm(p => {
      const jmesValue = bonding
        ? (totalJmes / 100) * (100 - sliderValue)
        : totalJmes + (totalBondedJmes / 100) * sliderValue;
      const bJmesValue = bonding
        ? (totalJmes / 100) * sliderValue + totalBondedJmes
        : (totalBondedJmes / 100) * (100 - sliderValue);
      const value = bonding
        ? bJmesValue - totalBondedJmes
        : jmesValue - totalJmes;
      return {
        ...p,
        jmesValue: Number(jmesValue.toFixed(0)),
        bJmesValue: Number(bJmesValue.toFixed(0)),
        valueToMove: Number(value.toFixed(0)),
        sliderValue,
      };
    });
  };

  const onValueChange = useCallback(
    (val: string) => {
      const value = Number(val);
      if (isNaN(value)) return;
      setTransferForm(p => {
        return {
          ...p,
          jmesValue: bonding ? totalJmes - value : totalJmes + value,
          bJmesValue: !bonding
            ? totalBondedJmes - value
            : totalBondedJmes + value,
          sliderValue: bonding
            ? Number((value / (totalJmes / 100)).toFixed(0))
            : Number((value / (totalBondedJmes / 100)).toFixed(0)),
          valueToMove: value,
        };
      });
    },
    [bonding, totalBondedJmes, totalJmes],
  );

  const bondingIsValid = useMemo(() => {
    return jmesValue > 0 && totalJmes > 0;
  }, [totalJmes, jmesValue]);

  const isMovingNotValid = useMemo(() => {
    return movingValidator(
      {
        total: bonding ? totalJmes : totalBondedJmes,
        current: bonding ? jmesValue : bJmesValue,
        transfer: valueToMove,
      },
      bonding,
    );
  }, [bonding, totalBondedJmes, totalJmes, bJmesValue, jmesValue, valueToMove]);

  const delegateTokens = useCallback(async () => {
    if (isMovingNotValid || !bondingIsValid || !address) {
      toast({
        title: `Can't ${
          bonding ? 'delegate' : 'undelegate'
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
        if (!selectedValidator) {
          return;
        }
        await signingCosmWasmClient?.delegateTokens(
          address,
          selectedValidator,
          coin(valueToMove * 1e6, JMES_DENOM),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /// @ts-ignore ( Issue with different type)
          'auto',
        );

        toast({
          title: 'Delegated Token ',
        });
      } else {
        if (!selectedUnBonding) {
          return;
        }
        await signingCosmWasmClient?.undelegateTokens(
          address,
          selectedUnBonding,
          coin(valueToMove * 1e6, BJMES_DENOM),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /// @ts-ignore ( Issue with different type)
          'auto',
        );
        toast({
          title: 'UnDelegated Token ',
        });
      }
      await refresh();
    } catch (err) {
      if (err instanceof Error)
        toast({
          status: 'error',
          title: err.message,
        });
    }
    setTransferForm(p => ({
      ...p,
      jmesValue: Number(totalJmes.toFixed(0)),
      bJmesValue: Number(totalBondedJmes.toFixed(0)),
      valueToMove: 0,
      sliderValue: sliderDefaultValue,
    }));
    setBondingState(p => ({
      ...p,
      delegatingToken: false,
    }));
  }, [
    isMovingNotValid,
    bondingIsValid,
    address,
    toast,
    bonding,
    selectedValidator,
    signingCosmWasmClient,
    valueToMove,
    selectedUnBonding,
    refresh,
    totalJmes,
    totalBondedJmes,
  ]);

  return {
    ...transferForm,
    ...bondingState,
    totalJmes,
    totalBondedJmes,
    setBondingState,
    bondingIsValid,
    setTransferForm,
    isValidatorsLoading,
    validatorList,
    toggleBonding,
    onChangeSlider,
    valueToMove,
    isMovingNotValid,
    delegateTokens,
    bondedValidators,
    isBondedValidatorsLoading,
    validatorsError,
    bondedValidatorsError,
    unBondingsData,
    unBondingsError,
    isLoadingUnBondings,
    onValueChange,
  };
};
