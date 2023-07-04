/* eslint-disable @typescript-eslint/ban-types */
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useEffect } from 'react';
import { DaoMultisigQueryClient } from '../../client/DaoMultisig.client';
import { useDaoMultisigListVotersQuery } from '../../client/DaoMultisig.react-query';
import { IdentityserviceQueryClient } from '../../client/Identityservice.client';
import { useIdentityserviceGetIdentityByOwnerQuery } from '../../client/Identityservice.react-query';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';

const tooltip_text =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';


const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

const LCDOptions = {
  URL: RPC_URL,
  chainID: CHAIN_ID,
};

export default function DaoMembersList({
  setSelectedDaoMembersList,
  daoQueryClient: daoMultisigQueryClient,
}: {
  daoQueryClient: DaoMultisigQueryClient;
  setSelectedDaoMembersList: Function;
}) {
  const { data, isLoading, isFetching } = useDaoMultisigListVotersQuery({
    client: daoMultisigQueryClient,
    args: {},
  });
  return (
    <Box width={'265px'} marginLeft={'41px'}>
      <Flex>
        <Text
          color="rgba(15,0,86,0.8)"
          fontWeight="medium"
          fontSize={12}
          marginRight={'6px'}
          marginBottom={'12px'}
          fontFamily="DM Sans"
        >
          DAO MEMBERS
        </Text>
        <Tooltip
          hasArrow={true}
          label={tooltip_text}
          bg={'midnight'}
          color={'white'}
          direction={'rtl'}
          placement={'top'}
          borderRadius={'10px'}
          width={'173px'}
          height={'86px'}
        >
          <QuestionOutlineIcon
            width={'16px'}
            height={'16px'}
            color={'rgba(0,0,0,0.4)'}
          />
        </Tooltip>
      </Flex>
      <MembersList
        members={data ? data?.voters : []}
        setSelectedDaoMembersList={setSelectedDaoMembersList}
      />

      {(isFetching || isLoading) && !data && (
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
  setSelectedDaoMembersList,
}: {
  // TODO: fix ts type
  members: any;
  setSelectedDaoMembersList: Function;
}) => {
  const totalWeight = members?.reduce(
    (acc: any, o: any) => acc + parseInt(o.weight),
    0,
  );

  const membersList = members?.map((member: any) => {
    const weight = member.weight;
    return (
      <DaoMembersListItem
        key={member.addr}
        address={member.addr}
        weightPercent={(weight / totalWeight) * 100}
        members={members}
        setSelectedDaoMembersList={setSelectedDaoMembersList}
      />
    );
  });

  return <ul>{membersList}</ul>;
};

export const DaoMembersListItem = ({
  address,
  weightPercent,
  members,
  setSelectedDaoMembersList,
}: {
  address: string;
  weightPercent: any;
  members?: Array<any>;
  setSelectedDaoMembersList: Function;
}) => {
  const { cosmWasmClient } = useCosmWasmClientContext();

  const identityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,

    IDENTITY_SERVICE_CONTRACT,
  );

  const identityQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address },
  });

  useEffect(() => {
    if (identityQuery.data) {
      const updatedMembers = members?.map(item => {
        if (item.addr === address) {
          return {
            ...item,
            name: identityQuery.data?.identity?.name as string,
          };
        }
        return item;
      });

      setSelectedDaoMembersList(updatedMembers);
    }
  }, [address, identityQuery.data, members, setSelectedDaoMembersList]);

  return (
    <Flex
      width={'265px'}
      height={'54px'}
      marginBottom={'6px'}
      alignItems={'center'}
    >
      <Flex
        width={'100%'}
        height={'48px'}
        borderColor={'rgba(116,83,256,0.3)'}
        borderWidth={'1px'}
        borderRadius={'90px'}
        backgroundColor={'white'}
        alignItems={'center'}
        paddingLeft={'20px'}
      >
        <Text
          color="purple"
          fontWeight="medium"
          fontSize={14}
          fontFamily="DM Sans"
        >
          {identityQuery.data
            ? identityQuery.data?.identity?.name
            : `${address?.substring(0, 10)}...`}
        </Text>
      </Flex>
      <span
        style={{
          zIndex: 99999,
          position: 'fixed',
        }}
      >
        <Flex
          width={'54px'}
          height={'54px'}
          borderColor={'rgba(116,83,256,0.3)'}
          borderWidth={'1px'}
          borderRadius={'360px'}
          backgroundColor={'white'}
          marginLeft={'211px'}
          justifyContent={'center'}
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
