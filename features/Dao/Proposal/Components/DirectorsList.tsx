/* eslint-disable @typescript-eslint/ban-types */
import {
  Badge,
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Image,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import { useIdentityserviceGetIdentityByOwnerQuery } from '../../../../client/Identityservice.react-query';
import { useCosmWasmClientContext } from '../../../../contexts/CosmWasmClient';
import { VoteInfo } from '../../../../client/DaoMultisig.types';
import { useClipboardTimeout } from '../../../../hooks/useClipboard';
import { useMemo, useState } from 'react';
// FIXME: fix this

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export default function DirectoresList({
  voters,
  loading,
}: {
  voters: VoteInfo[];
  loading: boolean;
}) {
  return (
    <Box width={'100%'}>
      <Flex>
        <Text
          color="rgba(15,0,86,0.8)"
          fontWeight="medium"
          fontSize={12}
          marginRight={'6px'}
          marginBottom={'12px'}
          fontFamily="DM Sans"
        >
          DIRECTORS
        </Text>
      </Flex>
      <MembersList members={voters} />

      {loading && !voters && (
        <Flex justifyContent="center" width="100%">
          <Text
            color="rgba(15,0,86,0.8)"
            fontFamily={'DM Sans'}
            fontWeight="normal"
            fontStyle={'italic'}
            fontSize={14}
            marginTop={'24px'}
          >
            Loading members...
          </Text>
        </Flex>
      )}
    </Box>
  );
}

export const MembersList = ({
  members,
}: {
  // TODO: fix ts type
  members: VoteInfo[];
}) => {
  const totalWeight = members?.reduce(
    (acc: number, o: VoteInfo) => acc + o.weight,
    0,
  );

  return (
    <ul>
      {members?.map(member => {
        const weight = member.weight;
        return (
          <DaoMembersListItem
            isYes={member.vote === 'yes'}
            key={member.voter}
            address={member.voter}
            weightPercent={(weight / totalWeight) * 100}
          />
        );
      })}
    </ul>
  );
};

export const DaoMembersListItem = ({
  address,
  weightPercent,
  isYes,
}: {
  address: string;
  weightPercent: any;
  isYes: boolean;
}) => {
  const [mouseEnter, setOnMouseEnter] = useState(false);
  const { cosmWasmClient } = useCosmWasmClientContext();
  const [copied, copyToClipbaord] = useClipboardTimeout();
  const identityserviceQueryClient = useMemo(
    () =>
      new IdentityserviceQueryClient(
        cosmWasmClient as CosmWasmClient,

        IDENTITY_SERVICE_CONTRACT,
      ),
    [cosmWasmClient],
  );

  const identityQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address },
  });

  return (
    <Flex
      width={'100%'}
      height={'54px'}
      marginBottom={'6px'}
      bg="white"
      alignItems={'center'}
      borderColor={'rgba(116,83,256,0.3)'}
      borderWidth={'1px'}
      borderRadius="12px"
      _hover={{
        bg: 'rgba(198, 180, 252, 0.10)',
        borderColor: 'rgba(116,83,256,0.3)',
      }}
      pos="relative"
      onMouseEnter={() => {
        setOnMouseEnter(true);
      }}
      onMouseLeave={() => {
        setOnMouseEnter(false);
      }}
    >
      <Flex
        p="1px"
        width={'80%'}
        height={'54px'}
        justifyContent="space-between"
        alignItems={'center'}
        paddingLeft={'20px'}
      >
        <Flex flexDir="column">
          <Flex>
            <Text
              color="purple"
              fontWeight="medium"
              fontSize={16}
              fontFamily="DM Sans"
            >
              {identityQuery.data
                ? identityQuery.data?.identity?.name
                : `${address?.substring(0, 10)}...`}
            </Text>
            <div>
              {copied && (
                <Text display="inline" ml="2" fontSize={14}>
                  copied
                </Text>
              )}
              {(mouseEnter || copied) && (
                <Tooltip label="Copy wallet address" hasArrow placement="top">
                  <Image
                    cursor="pointer"
                    display="inline-block"
                    src="/copy.svg"
                    width="16px"
                    height="16px"
                    marginLeft="4px"
                    alt="bjmes"
                    onClick={() => {
                      copyToClipbaord(address);
                    }}
                  />
                </Tooltip>
              )}
            </div>
          </Flex>
          <Text
            color="midnight"
            fontWeight="medium"
            fontSize={12}
            fontFamily="DM Sans"
          >
            {address.slice(0, 20)}...{address.slice(-6) ?? ''}
          </Text>
        </Flex>
        <Badge
          fontWeight="normal"
          rounded="full"
          px="3"
          py="1"
          bg={isYes ? 'green' : 'red'}
        >
          {isYes ? 'Yes' : 'No'}
        </Badge>
      </Flex>
      <span
        style={{
          zIndex: 999,
          position: 'absolute',
          right: '-10px',
        }}
      >
        <Flex
          width={'54px'}
          height={'54px'}
          borderColor={'rgba(116,83,256,0.3)'}
          borderWidth={'1px'}
          borderRadius={'360px'}
          backgroundColor={'white'}
          marginLeft={'51px'}
          justifyContent={'center'}
          pos="relative"
        >
          <Center>
            <CircularProgress
              value={weightPercent}
              size={'44px'}
              thickness={'8px'}
              color={'#4FD1C5'}
            >
              <CircularProgressLabel
                color="rgba(0,0,0,0.7)"
                fontWeight="bold"
                fontSize={10}
              >
                {weightPercent}%
              </CircularProgressLabel>
            </CircularProgress>
          </Center>
        </Flex>
      </span>
    </Flex>
  );
};
