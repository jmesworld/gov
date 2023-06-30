import {
  Box,
  Button,
  CircularProgress,
  CloseButton,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Text,
  Textarea,
  Tooltip,
  color,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import {
  countObjectsWithDuplicateNames,
  validateName,
} from '../../utils/identity';
import { AddIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from '../../client/Identityservice.client';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../config/defaults';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import { useQuery } from '@tanstack/react-query';
import { useIdentityserviceRegisterDaoMutation } from '../../client/Identityservice.react-query';
import { StdFee } from '@cosmjs/amino';

import { useAccountBalance } from '../../hooks/useAccountBalance';
import { ProposalType } from '../components/Proposal/ProposalType';
const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};

const SpendDaoFundsForm = ({
  daoOwner,
  setCreateDaoSelected,
  identityName,
  selectedDao,
  selectedDaoName,
}: {
  daoOwner: { name: string; address: string; votingPower: number };
  setCreateDaoSelected: Function;
  identityName: string;
  selectedDao: string;
  selectedDaoName: string;
}) => {
  const { address, status, getCosmWasmClient, getSigningCosmWasmClient } =
    useChain(chainName);
  const [daoName, setDaoName] = useState('');
  const [daoMembers, setDaoMembers] = useState([daoOwner]);
  const [threshold, setThreshold] = useState(50);
  const [isIdentityNamesValid, setIdentityNamesValid] = useState(false);
  const [focusedCosignerIndex, setFocusedCosignerIndex] = useState(Infinity);
  const [isCreatingDao, setIsCreatingDao] = useState(false);
  const [doubleCounts, setDoubleCounts] = useState(0);

  const toast = useToast();
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null,
  );
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);
  const balance = useAccountBalance(address as string);
  const [bal, setBal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const proposalTypes = ['spend-funds'];
  const [selectedProposalType, setSelectedProposalType] = useState(
    proposalTypes[0],
  );
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  // useEffect(() => {
  //   if (address) {
  //     console.log("update");
  //     getCosmWasmClient()
  //       .then((cosmWasmClient) => {
  //         if (!cosmWasmClient) {
  //           return;
  //         }
  //         setCosmWasmClient(cosmWasmClient);
  //       })
  //       .catch((error) => console.log(error));

  //     getSigningCosmWasmClient()
  //       .then((signingClient) => {
  //         if (!signingClient) {
  //           return;
  //         }
  //         setSigningClient(signingClient);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // }, [address, getCosmWasmClient, getSigningCosmWasmClient]);

  useEffect(() => {
    if (address) {
      console.log('update');
      getCosmWasmClient()
        .then(cosmWasmClient => {
          if (!cosmWasmClient) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch(error => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  const validationResult = validateName(daoName);
  const isDaoNameValid = !validationResult?.name;

  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT,
  );

  async function getIdentitiesByNames() {
    let identityAddrs = new Array();

    for (let j = 0; j < daoMembers.length; j++) {
      const name = daoMembers[j].name;
      const identityRes = await client.getIdentityByName({ name: name });
      if (identityRes.identity?.name === name) {
        identityAddrs[j] = identityRes.identity?.owner;
        daoMembers[j].address = identityRes.identity?.owner;
        setDaoMembers(daoMembers);
      } else {
        identityAddrs[j] = 'Invalid identity';
      }
    }

    if (identityAddrs.includes('Invalid identity')) {
      setIdentityNamesValid(false);
    } else {
      setIdentityNamesValid(true);
    }
    return identityAddrs;
  }

  const idsByNamesQuery = useQuery(['identities'], getIdentitiesByNames);

  const isFormValid =
    totalAmount === 100 &&
    isDaoNameValid &&
    threshold > 0 &&
    (isIdentityNamesValid || daoMembers.length === 1) &&
    doubleCounts === 0;

  const idClient: IdentityserviceClient = new IdentityserviceClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    IDENTITY_SERVICE_CONTRACT,
  );

  const members = daoMembers.map(member => ({
    addr: member.address,
    weight: member.votingPower,
  }));

  const registerDaoMutation = useIdentityserviceRegisterDaoMutation();

  useEffect(() => {
    const dups = countObjectsWithDuplicateNames(daoMembers);
    setDoubleCounts(dups);
  });

  const TabSelect = (
    <Box marginRight={'44px'}>
      <Text
        color={'rgba(15,0,86,0.8)'}
        fontWeight="medium"
        fontSize={12}
        fontFamily="DM Sans"
        marginBottom={'17px'}
      >
        SELECT PROPOSAL TYPE
      </Text>
      {proposalTypes.map(proposalType => (
        <ProposalType
          key={proposalType}
          type={proposalType}
          isActive={proposalType === selectedProposalType}
          onClick={() => setSelectedProposalType(proposalType)}
        />
      ))}
    </Box>
  );
  const DetailSection = (
    <Box>
      <Text
        color={'rgba(15,0,86,0.8)'}
        fontWeight="medium"
        fontSize={12}
        fontFamily="DM Sans"
        marginBottom={'17px'}
      >
        DETAILS
      </Text>
      <Input
        variant={'outline'}
        height={'48px'}
        borderColor={'primary.500'}
        background={'primary.100'}
        focusBorderColor="darkPurple"
        borderRadius={12}
        color={'purple'}
        onChange={e => setProposalTitle(e.target.value)}
        placeholder={'Title'}
      />
      <Box height={'12px'} />
      <Textarea
        variant={'outline'}
        width={'874px'}
        height={'320px'}
        borderColor={'primary.500'}
        background={'primary.100'}
        focusBorderColor="darkPurple"
        borderRadius={12}
        color={'purple'}
        onChange={e => setProposalDescription(e.target.value)}
        placeholder={'Description'}
      />
    </Box>
  );
  const AmountSection = (
    <Box>
      <Text
        marginBottom={'8px'}
        color={'rgba(0,0,0,0.7)'}
        fontFamily={'DM Sans'}
        fontWeight="normal"
        fontSize={12}
        marginLeft={'18px'}
        marginTop={'8px'}
      >
        {daoName.length > 0
          ? isDaoNameValid
            ? ''
            : validationResult.message
          : ''}
      </Text>
      <Flex marginTop={'27px'} marginLeft={'270px'} marginRight={'52px'}>
        <Button
          variant={'outline'}
          borderColor={'purple'}
          width={'209px'}
          height={'48px'}
          marginBottom="30px"
          onClick={() => {
            setDaoMembers([
              ...daoMembers,
              { name: '', address: '', votingPower: 0 },
            ]);
          }}
          borderRadius={50}
          backgroundColor={'transparent'}
          _hover={{ bg: 'transparent' }}
          justifyContent={'start'}
        >
          <Flex alignItems={'center'}>
            <AddIcon boxSize={'10px'} color="purple" />
            <Text
              color="purple"
              fontWeight="medium"
              fontSize={14}
              marginLeft={'10px'}
              fontFamily="DM Sans"
            >
              Add Receiver address
            </Text>
          </Flex>
        </Button>

        <Text
          color={'rgba(15,0,86,0.8)'}
          fontFamily="DM Sans"
          fontSize={12}
          fontWeight="medium"
          alignSelf={'end'}
          marginLeft={'auto'}
          marginRight={'15%'}
          marginBottom={'9px'}
        >
          AMOUNT
        </Text>
      </Flex>
      {daoMembers.map((daoMember, index) => (
        <Flex marginLeft={'270px'} key={index} marginBottom={'16px'}>
          <InputGroup height={'48px'}>
            <Input
              isReadOnly={index === 0}
              variant={'outline'}
              borderColor={'primary.500'}
              background={'primary.100'}
              focusBorderColor="darkPurple"
              borderRadius={12}
              marginRight={'16px'}
              color={'darkPurple'}
              height={'100%'}
              defaultValue={daoMember?.name}
              fontWeight={'normal'}
              onChange={e => {
                daoMembers[index].name = e.target.value.trim();
                setDaoMembers(daoMembers);
                setIdentityNamesValid(false);
              }}
              onBlur={() => idsByNamesQuery.refetch()}
              onFocus={() => {
                setFocusedCosignerIndex(index);
              }}
            />
            <InputRightElement
              width="75%"
              justifyContent={'start'}
              height={'100%'}
            >
              <Text
                color={'purple'}
                fontFamily="DM Sans"
                fontSize={16}
                fontWeight="normal"
              >
                {index > 0
                  ? !validateName(daoMember?.name)?.name
                    ? !idsByNamesQuery.isFetching
                      ? idsByNamesQuery?.data?.at(index)
                      : index === focusedCosignerIndex
                      ? 'Checking...'
                      : idsByNamesQuery?.data?.at(index)
                    : ''
                  : daoMember.address}
              </Text>
            </InputRightElement>
          </InputGroup>
          <InputGroup width={'235px'} height={'48px'}>
            <Input
              variant={'outline'}
              width={'235px'}
              height={'100%'}
              borderColor={'primary.500'}
              background={'primary.100'}
              focusBorderColor="darkPurple"
              borderRadius={12}
              color={'purple'}
              fontWeight={'normal'}
              value={daoMember?.votingPower}
              type={'number'}
              onChange={e => {
                const updatedDaoMembers = daoMembers.map((daoMember, i) => {
                  if (i === index) {
                    return {
                      ...daoMember,
                      votingPower: parseInt(e.target.value),
                    };
                  } else {
                    return daoMember;
                  }
                });
                setDaoMembers(updatedDaoMembers);
              }}
            />
          </InputGroup>
          {index > 0 ? (
            <CloseButton
              size={'24px'}
              _hover={{ backgroundColor: 'transparent' }}
              color={'rgba(15,0,86,0.3)'}
              onClick={() => {
                daoMembers.splice(index, 1);
                setDaoMembers(daoMembers);
              }}
            />
          ) : (
            <></>
          )}
        </Flex>
      ))}
      <Flex height={'48px'} marginTop={'40px'} flexDirection={'column'}>
        <Text
          color={'rgba(15,0,86,0.8)'}
          fontFamily="DM Sans"
          fontSize={12}
          fontWeight="medium"
          alignSelf={'flex-end'}
          marginRight={'17%'}
        >
          TOTAL
        </Text>
        <InputGroup width={'235px'} height={'48px'} marginLeft={'auto'}>
          <Input
            variant={'outline'}
            width={'235px'}
            height={'48px'}
            borderColor={'primary.500'}
            background={totalAmount > bal ? 'red' : 'purple'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={'white'}
            fontWeight={'normal'}
            value={totalAmount}
          />
        </InputGroup>
      </Flex>
    </Box>
  );
  return (
    <Box>
      <Flex>
        {TabSelect}
        {DetailSection}
      </Flex>
      {AmountSection}
      <Text
        marginBottom={'8px'}
        color={'red'}
        fontFamily={'DM Sans'}
        fontWeight="normal"
        fontSize={18}
        marginLeft={'12px'}
        marginTop={'8px'}
      >
        {doubleCounts > 0
          ? 'Single member identity entered more than once!'
          : ''}
      </Text>
      <Box marginLeft={'270px'}>
        <Text
          marginTop={'93px'}
          color={'rgba(15,0,86,0.8)'}
          fontFamily="DM Sans"
          fontSize={12}
          fontWeight="medium"
          marginBottom={'8px'}
        >
          % TO PASS
        </Text>
        <Slider
          aria-label="dao-proposal-threshold"
          defaultValue={50}
          width={'722px'}
          onChange={val => setThreshold(val)}
        >
          <SliderTrack
            height={'16px'}
            borderRadius={'10px'}
            backgroundColor={'primary.100'}
            borderColor={'primary.500'}
            borderWidth={'1px'}
          >
            <SliderFilledTrack backgroundColor={'green'} />
          </SliderTrack>
          <Tooltip
            isOpen
            hasArrow={true}
            label={`${threshold} %`}
            bg={'purple'}
            color={'white'}
            direction={'rtl'}
            placement={'top'}
            borderRadius={'10px'}
          >
            <SliderThumb height={'32px'} />
          </Tooltip>
        </Slider>
        <Flex
          marginTop={'12px'}
          marginBottom={'93px'}
          height={'48px'}
          alignItems={'center'}
          width={'100%'}
        >
          <QuestionOutlineIcon
            width={'16px'}
            height={'16px'}
            color={'rgba(0,0,0,0.4)'}
          />

          <Spacer />
          <Button
            width={'99px'}
            height={'42px'}
            variant={'link'}
            onClick={() => setCreateDaoSelected(false)}
          >
            <Text
              color={'darkPurple'}
              fontFamily="DM Sans"
              fontSize={14}
              fontWeight="medium"
              style={{ textDecoration: 'underline' }}
            >
              Cancel
            </Text>
          </Button>
          <Box width={'12px'} />
          <Button
            disabled={!isFormValid}
            onClick={() => {
              setIsCreatingDao(true);
              registerDaoMutation
                .mutateAsync({
                  client: idClient,
                  msg: {
                    daoName: daoName.trim(),
                    maxVotingPeriod: {
                      height: 1180000,
                    },
                    members: members,
                    thresholdPercentage: threshold,
                  },
                  args: { fee },
                })
                .then(result => {
                  toast({
                    title: 'Dao created.',
                    description:
                      "We've created your Dao for you. You'll be able to access it shortly.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    containerStyle: {
                      backgroundColor: 'darkPurple',
                      borderRadius: 12,
                    },
                  });
                })
                .catch(error => {
                  toast({
                    title: 'Dao creation error',
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
                .finally(() => setIsCreatingDao(false));
            }}
            backgroundColor={'green'}
            borderRadius={90}
            alignContent="end"
            width={'148px'}
            height={'42px'}
            alignSelf="center"
            _hover={{ bg: 'green' }}
            variant={'outline'}
            borderWidth={'1px'}
            borderColor={'rgba(0,0,0,0.1)'}
          >
            {!isCreatingDao ? (
              <Text
                color="midnight"
                fontFamily={'DM Sans'}
                fontWeight="medium"
                fontSize={14}
              >
                Create
              </Text>
            ) : (
              <CircularProgress
                isIndeterminate
                size={'24px'}
                color="midnight"
              />
            )}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default SpendDaoFundsForm;
