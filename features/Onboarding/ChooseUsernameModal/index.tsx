import { useToast } from '@chakra-ui/react';

import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';

import { useEffect, useState, useDeferredValue, useMemo } from 'react';
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from '../../../client/Identityservice.client';
import { StdFee } from '@cosmjs/stargate';
import { WalletStatus } from '@cosmos-kit/core';
import {
  useIdentityserviceGetIdentityByNameQuery,
  useIdentityserviceRegisterUserMutation,
} from '../../../client/Identityservice.react-query';
import {
  ChooseUsernameCardComponent,
  SearchResults,
} from './ChooseUsernameModalComponent';
import { useCosmWasmClientContext } from '../../../contexts/CosmWasmClient';
import { useDebounce } from '../../../hooks/useDebounce';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../../config/defaults';

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

const fee: StdFee = {
  amount: [
    {
      denom: 'ujmes',
      amount: '2',
    },
  ],
  gas: '1000000',
};
interface ChooseUsernameCardProps {
  identityName: string;
}

const ChooseUsernameCard = ({ identityName }: ChooseUsernameCardProps) => {
  const [identityNameInput] = useState(identityName ?? '');
  const [isIdentityNameAvailable, setIsIdentityNameAvailable] = useState(false);
  const [isCreatingIdentity, setIsCreatingIdentity] = useState(false);
  const { cosmWasmClient } = useCosmWasmClientContext();
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);

  const { disconnect, address, status, closeView, getSigningCosmWasmClient } =
    useChain(chainName);

  const toast = useToast();

  useEffect(() => {
    if (address) {
      (async () => {
        try {
          const signingClient = await getSigningCosmWasmClient?.();
          signingClient && setSigningClient(signingClient);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [address, getSigningCosmWasmClient]);

  const client: IdentityserviceQueryClient = useMemo(
    () =>
      new IdentityserviceQueryClient(
        cosmWasmClient as CosmWasmClient,
        IDENTITY_SERVICE_CONTRACT,
      ),
    [cosmWasmClient],
  );

  const idClient: IdentityserviceClient = new IdentityserviceClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    IDENTITY_SERVICE_CONTRACT,
  );
  const identityMutation = useIdentityserviceRegisterUserMutation();
  const identityNameQuery = useIdentityserviceGetIdentityByNameQuery({
    client,
    args: { name: identityNameInput },
    options: {
      onSuccess: data => {
        if (!data?.identity?.name.toString()) {
          setIsIdentityNameAvailable(true);
        }
      },
      onError: error => {
        console.error(error); //this error
      },

      cacheTime: 0,
      enabled: identityNameInput?.length > 2,
    },
  });

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce<string>({
    value: query,
    delay: 300,
  });
  const deferredQuery = useDeferredValue(debouncedQuery);

  const onDisconnect = () => {
    disconnect?.();
  };

  const showInputCheckIcon =
    !!identityName &&
    identityNameQuery?.data?.identity?.name.toString() !== identityName;

  const onIdentityCreateClick = () => {
    setIsCreatingIdentity(true);
    identityMutation
      .mutateAsync({
        client: idClient,
        msg: {
          name: query,
        },
        args: { fee },
      })
      .then(() => {
        toast({
          title: 'Identity created.',
          description: "We've created your Identity for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
          containerStyle: {
            backgroundColor: 'darkPurple',
            borderRadius: 12,
          },
        });
        closeView?.();
      })
      .catch(error => {
        toast({
          title: 'Identity creation error',
          description: error.toString(),
          status: 'error',
          duration: 9000,
          isClosable: true,
          containerStyle: {
            backgroundColor: 'red',
            borderRadius: 12,
          },
        });
      })
      .finally(() => setIsCreatingIdentity(false));
  };

  return (
    <ChooseUsernameCardComponent
      usernameInputDisabled={!(status === WalletStatus.Connected)}
      onDisconnect={onDisconnect}
      isCreatingIdentity={isCreatingIdentity}
      usernameInput={query}
      onUsernameChange={setQuery}
      onUsernameInputBlur={() => identityNameQuery.refetch()}
      showInputCheckIcon={showInputCheckIcon}
      createIdentityDisabled={!isIdentityNameAvailable}
      searchComponent={
        <SearchResults
          client={client}
          setIsIdentityNameAvailable={setIsIdentityNameAvailable}
          query={deferredQuery}
        />
      }
      onIdentityCreateClick={onIdentityCreateClick}
    />
  );
};

export default ChooseUsernameCard;
