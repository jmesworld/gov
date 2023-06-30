import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  CosmWasmClient,
  MsgExecuteContractEncodeObject,
} from '@cosmjs/cosmwasm-stargate';
import { WalletStatus } from '@cosmos-kit/core';
import { useChain } from '@cosmos-kit/react';
import { useMutation } from '@tanstack/react-query';
import { MouseEventHandler, useEffect, useState } from 'react';

import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toHex, toUtf8 } from '@cosmjs/encoding';
import { StdFee } from '@cosmjs/stargate';
import { ExecuteMsg } from '../../../client/Identityservice.types';
import { IdentityserviceQueryClient } from '../../../client/Identityservice.client';
import { useIdentityserviceGetIdentityByNameQuery } from '../../../client/Identityservice.react-query';
import { chainName } from '../../../config/defaults';

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
const NEXT_PUBLIC_BJMES_TOKEN_CONTRACT = process.env
  .NEXT_PUBLIC_BJMES_TOKEN_CONTRACT as string;

export const CreateIdentitySection = () => {
  const chainContext = useChain(chainName);
  const { status } = chainContext;

  return (
    <Box
      width={'881px'}
      height={'217px'}
      backgroundColor="#704FF7"
      borderRadius={12}
      paddingTop="19px"
      paddingRight="33px"
    >
      <Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(1, 1fr)">
        <GridItem colSpan={1}>
          <Image
            src="/Create_Identity.svg"
            alt="Create Identity"
            width={'177.44px'}
            height={'159.75px'}
            marginLeft={'46px'}
          ></Image>
        </GridItem>
        <GridItem colSpan={3}>
          <Box marginLeft={'69px'} marginTop={'11px'}>
            <Text
              color={'white'}
              fontFamily="DM Sans"
              fontSize={28}
              fontWeight="normal"
            >
              {status === WalletStatus.Connected
                ? `Let's create a JMES Identity`
                : `Then create a JMES Identity`}
            </Text>
            <IdentityInputSection />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default function IdentityInputSection() {
  const chainContext = useChain(chainName);

  const { address, status, getCosmWasmClient, getSigningCosmWasmClient } =
    chainContext;

  const toast = useToast();

  const [identityName, setIdentityName] = useState('');
  const [isIdentityNameAvailable, setIsIdentityNameAvailable] = useState(false);

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null,
  );
  useEffect(() => {
    getCosmWasmClient()
      .then(cosmWasmClient => {
        if (!cosmWasmClient) {
          return;
        }
        setCosmWasmClient(cosmWasmClient);
      })
      .catch(error => console.log(error));
  }, [getCosmWasmClient]);
  // console.log(cosmWasmClient)
  const args = { owner: address ? address : '' };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT,
  );

  const identityMutation = useMutation(['identityMutation'], registerUser);

  async function registerUser() {
    const signingCosmWasmClient = await getSigningCosmWasmClient();
    const contract = IDENTITY_SERVICE_CONTRACT;

    const msg: ExecuteMsg = { register_user: { name: identityName } };

    const fee: StdFee = {
      amount: [
        {
          denom: 'ujmes',
          amount: '2000',
        },
      ],
      gas: '1000000',
    };

    const execMsg: MsgExecuteContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: address,
        contract: IDENTITY_SERVICE_CONTRACT,
        msg: toUtf8(JSON.stringify(msg)),
      }),
    };

    try {
      const result = await signingCosmWasmClient.signAndBroadcast(
        address as string,
        [execMsg],
        fee,
      );

      if (result.code === 0) {
        toast({
          title: 'Identity created.',
          description: "We've created your identity for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Identity creation error.',
          description: result.code,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
      // window.location.reload();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  const identityNameQuery = useIdentityserviceGetIdentityByNameQuery({
    client,
    args: { name: identityName },
    options: {
      onSuccess: data => {
        if (!!!data?.identity?.name.toString()) {
          setIsIdentityNameAvailable(true);
        }
      },
    },
  });

  return (
    <>
      <Flex marginTop={'19px'}>
        <Input
          disabled={status === WalletStatus.Connected ? false : true}
          width={'100%'}
          height={'49px'}
          backgroundColor="#5136C2"
          borderColor="#5136C2"
          borderRadius={12}
          marginRight={'21px'}
          alignItems="center"
          justifyContent="center"
          color="white"
          fontFamily="DM Sans"
          fontSize={'16px'}
          fontWeight="normal"
          value={identityName}
          onChange={event => {
            setIdentityName(event.target.value.trim());
            setIsIdentityNameAvailable(false);
          }}
          onBlur={() => {
            identityNameQuery.refetch();
          }}
        />
        <Spacer />
        <CreateIdentityButton onClick={() => identityMutation.mutate()} />
      </Flex>
      <Text
        marginBottom={'8px'}
        color="white"
        fontFamily={'DM Sans'}
        fontWeight="normal"
        fontSize={12}
        marginLeft={'18px'}
        marginTop={'2px'}
      >
        {identityName.length > 0
          ? identityNameQuery.isFetched
            ? identityNameQuery?.data?.identity?.name.toString() ===
              identityName
              ? 'Name taken!'
              : 'Available'
            : 'Checking...'
          : ''}
      </Text>
    </>
  );
}

export const CreateIdentityButton = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const chainContext = useChain(chainName);
  const { address, status } = chainContext;
  return (
    <Button
      disabled={WalletStatus.Connected ? false : true}
      backgroundColor={'#A1F0C4'}
      borderRadius={90}
      alignContent="end"
      width={'128px'}
      height={'42px'}
      onClick={onClick}
      alignSelf="center"
    >
      <Text
        color="#0F0056"
        fontFamily={'DM Sans'}
        fontWeight="medium"
        fontSize={14}
      >
        Create
      </Text>
    </Button>
  );
};
