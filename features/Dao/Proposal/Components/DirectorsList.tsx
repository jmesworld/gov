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
} from '@chakra-ui/react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import { useIdentityserviceGetIdentityByOwnerQuery } from '../../../../client/Identityservice.react-query';
import { useCosmWasmClientContext } from '../../../../contexts/CosmWasmClient';
import { VoteInfo } from '../../../../client/DaoMultisig.types';
import { useClipboardTimeout } from '../../../../hooks/useClipboard';
import { useState } from 'react';
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

  const membersList = members?.map(member => {
    const weight = member.weight;
    return (
      <DaoMembersListItem
        isYes={member.vote === 'yes'}
        key={member.voter}
        address={member.voter}
        weightPercent={(weight / totalWeight) * 100}
      />
    );
  });

  return <ul>{membersList}</ul>;
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
  const identityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,

    IDENTITY_SERVICE_CONTRACT,
  );

  const identityQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address },
  });

  return (
    <Flex
      width={'100%'}
      height={'50px'}
      marginBottom={'6px'}
      alignItems={'center'}
      borderColor={'rgba(116,83,256,0.3)'}
      borderWidth={'1px'}
      bg="white"
      borderRadius="20PX"
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
        // height={'48px'}
        justifyContent="space-between"
        borderRadius={'20px'}
        backgroundColor={'white'}
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
              )}
            </div>
          </Flex>
          <Text
            color="midnight"
            fontWeight="medium"
            fontSize={12}
            fontFamily="DM Sans"
          >
            <Image
              display="inline-block"
              src="/JMES_icon.svg"
              width="12px"
              height="12px"
              marginRight="4px"
              alt="bjmes"
            />
            0.0000
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
          zIndex: 99999,
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
