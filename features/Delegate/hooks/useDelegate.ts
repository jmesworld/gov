import { useCallback, useEffect, useMemo, useState } from 'react';
import { movingValidator } from '../lib/validateBonding';
import { useToast } from '@chakra-ui/react';
import { useIdentityContext } from '../../../contexts/IdentityContext';
import { JMES_DENOM } from '../../../lib/constants';
import { useBalanceContext } from '../../../contexts/balanceContext';
import { useSigningCosmWasmClientContext } from '../../../contexts/SigningCosmWasmClient';
import { coin } from '@cosmjs/amino';
import { useValidatorContext } from '../../../contexts/validatorsContext';

type TransferFormType = {
  jmesValue: number;
  bJmesValue: number;
  sliderValue: number;
  valueToMove: number | undefined;
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
    () => parseInt((balance?.jmes ?? 0).toString() ?? 0),
    [balance?.jmes],
  );
  const totalBondedJmes = useMemo(
    () => parseInt((balance?.bJmes ?? 0).toString() ?? 0),
    [balance?.bJmes],
  );

  const { address } = useIdentityContext();
  const {
    bondValidatorsLoading,
    unBondValidatorsLoading,
    myUnBondingsLoading,

    bondValidatorsError,
    unBondValidatorsError,
    myUnBondingError,

    bondValidators: validatorsMap,
    unBondValidators: unBondMap,
    myUnBondings: myUnBondingMap,

    refetchBondValidators,
    refetchMyUnBondingsValidators,
    refetchUnBondValidators,
  } = useValidatorContext();

  useEffect(() => {
    refetchBondValidators();
    refetchMyUnBondingsValidators();
    refetchUnBondValidators();
  }, [
    refetchBondValidators,
    refetchMyUnBondingsValidators,
    refetchUnBondValidators,
  ]);

  const bondValidators = useMemo(() => {
    return Array.from(validatorsMap?.values() ?? []);
  }, [validatorsMap]);

  const unBondValidators = useMemo(() => {
    return Array.from(unBondMap?.values() ?? []);
  }, [unBondMap]);

  const myUnBondings = useMemo(() => {
    return Array.from(myUnBondingMap?.values() ?? []);
  }, [myUnBondingMap]);

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
        jmesValue: parseInt(jmesValue.toString()),
        bJmesValue: parseInt(bJmesValue.toString()),
        valueToMove: parseInt(value.toString()),
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
          valueToMove: val === '' ? undefined : value,
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
        transfer: valueToMove ?? 0,
      },
      bonding,
      !bonding
        ? unBondValidators?.find(
            el => el.validator_address === selectedUnBonding,
          )
        : undefined,
    );
  }, [
    bonding,
    totalJmes,
    totalBondedJmes,
    jmesValue,
    bJmesValue,
    valueToMove,
    unBondValidators,
    selectedUnBonding,
  ]);

  const delegateTokens = useCallback(async () => {
    if (isMovingNotValid || !bondingIsValid || !address) {
      toast({
        title: `Can't ${
          bonding ? 'delegate' : 'undelegate'
        }, please fix the issues!`,
        duration: 4000,
        status: 'error',
        variant: 'custom',
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
          coin((valueToMove ?? 0) * 1e6, JMES_DENOM),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /// @ts-ignore ( Issue with different type)
          'auto',
        );

        toast({
          title: 'Bonded Tokens',
          status: 'success',
          variant: 'custom',
          isClosable: true,
        });
      } else {
        if (!selectedUnBonding) {
          return;
        }
        await signingCosmWasmClient?.undelegateTokens(
          address,
          selectedUnBonding,
          coin((valueToMove ?? 0) * 1e6, JMES_DENOM),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /// @ts-ignore ( Issue with different type)
          'auto',
        );
        toast({
          title: 'Unbonded Tokens',
          status: 'success',
          isClosable: true,
          variant: 'custom',
        });
      }
      await refetchMyUnBondingsValidators();
      await refresh();
      onChangeSlider(sliderDefaultValue);
    } catch (err) {
      if (err instanceof Error)
        toast({
          status: 'error',
          variant: 'custom',
          isClosable: true,
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
    refresh,
    refetchMyUnBondingsValidators,
    selectedValidator,
    signingCosmWasmClient,
    valueToMove,
    selectedUnBonding,
    totalJmes,
    totalBondedJmes,
  ]);

  return {
    ...transferForm,
    ...bondingState,
    totalJmes,
    validatorsMap,
    totalBondedJmes,
    setBondingState,
    bondingIsValid,
    setTransferForm,
    isValidatorsLoading: bondValidatorsLoading,
    validatorList: bondValidators,
    toggleBonding,
    onChangeSlider,
    valueToMove,
    isMovingNotValid,
    delegateTokens,
    bondedValidators: unBondValidators,
    isBondedValidatorsLoading: unBondValidatorsLoading,
    validatorsError: bondValidatorsError,
    bondedValidatorsError: unBondValidatorsError,
    unBondingsData: myUnBondings,
    unBondingsError: myUnBondingError,
    isLoadingUnBondings: myUnBondingsLoading,
    onValueChange,
  };
};
