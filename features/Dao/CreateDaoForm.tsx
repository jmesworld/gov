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
  Tooltip,
  color,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
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
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';
import { useSigningCosmWasmClientContext } from '../../contexts/SigningCosmWasmClient';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};

const DEFAULT_DAO_THRESHOLD = 100; // 100% threshold by default

const CreateDaoForm = ({
  setCreateDaoSelected,
  daoOwner,
}: {
  setCreateDaoSelected: Function;
  daoOwner: { name: string; address: string; votingPower: number };
}) => {
  const { address } = useChain(chainName);

  const toast = useToast();

  const [daoName, setDaoName] = useState('');
  const [daoMembers, setDaoMembers] = useState([daoOwner]);
  const [threshold, setThreshold] = useState(DEFAULT_DAO_THRESHOLD);
  const [isIdentityNamesValid, setIdentityNamesValid] = useState(false);
  const [focusedDirectorIndex, setFocusedDirectorIndex] = useState(Infinity);
  const [isCreatingDao, setIsCreatingDao] = useState(false);
  const [doubleCounts, setDoubleCounts] = useState(0);

  const { cosmWasmClient } = useCosmWasmClientContext();
  const { signingCosmWasmClient: signingClient } =
    useSigningCosmWasmClientContext();

  const totalVotingPower = useMemo(
    () =>
      daoMembers.reduce(
        (sum, member) => sum + (member?.votingPower ? member?.votingPower : 0),
        0,
      ),
    [daoMembers],
  );
  const validationResult = useMemo(() => validateName(daoName), [daoName]);
  const DAONameValidationMessage = useMemo(
    () => validationResult?.message,
    [validationResult],
  );

  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT,
  );

  async function getIdentitiesByNames() {
    const identityAddrs = [];

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
    totalVotingPower === 100 &&
    DAONameValidationMessage &&
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
  }, [daoMembers]);

  return (
    <Box marginTop={'35px'}>
      <Text
        color={'purple'}
        fontWeight="normal"
        fontFamily="DM Sans"
        fontSize={28}
        marginBottom={'60px'}
      >
        Create DAO
      </Text>
      <Text
        color={'rgba(15,0,86,0.8)'}
        fontFamily="DM Sans"
        fontSize={12}
        fontWeight="medium"
        marginBottom={'17px'}
      >
        DAO NAME
      </Text>
      <Input
        spellCheck="false"
        variant={'outline'}
        width={'798px'}
        height={'48px'}
        borderColor={'primary.500'}
        background={'primary.100'}
        focusBorderColor="darkPurple"
        borderRadius={12}
        color={'purple'}
        onChange={e => setDaoName(e.target.value)}
      />
      <Text
        color="red"
        marginBottom={'8px'}
        fontFamily={'DM Sans'}
        fontWeight="normal"
        fontSize={12}
        marginLeft={'18px'}
        marginTop={'8px'}
      >
        {daoName.length > 0 && DAONameValidationMessage}
      </Text>
      <Flex width={'798px'} marginTop={'38px'} marginBottom={'19px'}>
        <Button
          variant={'outline'}
          borderColor={'purple'}
          width={'126px'}
          height={'48px'}
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
          <Flex marginLeft={'0px'} alignItems={'center'}>
            <AddIcon boxSize={'10px'} color="#7453FD" />
            <Text
              color="purple"
              fontWeight="medium"
              fontSize={14}
              marginLeft={'10px'}
              fontFamily="DM Sans"
            >
              Director
            </Text>
          </Flex>
        </Button>
        <Box width={'8px'} />
        <Button
          variant={'outline'}
          borderColor={'purple'}
          width={'126px'}
          height={'48px'}
          onClick={() => {
            const power = 100 / daoMembers.length;
            daoMembers.forEach(member => (member.votingPower = power));
            setDaoMembers(daoMembers);
          }}
          borderRadius={50}
          backgroundColor={'transparent'}
          _hover={{ bg: 'transparent' }}
          justifyContent={'center'}
        >
          <Text
            color="purple"
            fontWeight="medium"
            fontSize={14}
            fontFamily="DM Sans"
          >
            Auto Distribute
          </Text>
        </Button>
        <Spacer />
        <Text
          color={'rgba(15,0,86,0.8)'}
          fontFamily="DM Sans"
          fontSize={12}
          fontWeight="medium"
          marginBottom={'17px'}
          marginRight={'50px'}
          alignSelf={'center'}
        >
          SHARE OF VOTES
        </Text>
      </Flex>
      {daoMembers.map((daoMember, index) => (
        <Flex key={index} marginBottom={'16px'}>
          <InputGroup width={'650px'} height={'48px'}>
            <Input
              spellCheck="false"
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
              onKeyDown={() => idsByNamesQuery.refetch()}
              onFocus={() => {
                setFocusedDirectorIndex(index);
              }}
            />
            <InputRightElement
              width="65%"
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
                    ? !idsByNamesQuery.isFetching ||
                      idsByNamesQuery.isRefetching
                      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        /// @ts-ignore
                        idsByNamesQuery?.data?.at(index)?.length > 43
                        ? idsByNamesQuery?.data?.at(index)?.slice(0, 43) + '...'
                        : idsByNamesQuery?.data?.at(index)
                      : index === focusedDirectorIndex
                      ? 'Checking...'
                      : idsByNamesQuery?.data?.at(index)
                    : ''
                  : daoMember.address}
              </Text>
            </InputRightElement>
          </InputGroup>
          <InputGroup width={'102px'} height={'48px'} marginRight={'16px'}>
            <Input
              variant={'outline'}
              width={'102px'}
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

            <InputRightElement height={'100%'}>
              <Text
                color={'purple'}
                fontFamily="DM Sans"
                fontSize={16}
                fontWeight="normal"
              >
                %
              </Text>
            </InputRightElement>
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
      <Flex
        marginTop={'16px'}
        height={'48px'}
        alignItems={'center'}
        width={'798px'}
      >
        <QuestionOutlineIcon
          width={'16px'}
          height={'16px'}
          color={'rgba(0,0,0,0.4)'}
        />
        <Text
          color={'rgba(0,0,0,0.7)'}
          fontFamily="DM Sans"
          fontSize={14}
          fontWeight="normal"
          marginLeft={'12px'}
        >
          Total Share of Votes must equal 100%
        </Text>
        <Spacer />
        <InputGroup width={'102px'} height={'48px'} marginRight={'44px'}>
          <Input
            variant={'outline'}
            width={'102px'}
            height={'100%'}
            borderColor={'primary.500'}
            background={totalVotingPower === 100 ? 'purple' : 'red'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={'white'}
            fontWeight={'normal'}
            value={totalVotingPower}
          />

          <InputRightElement height={'100%'}>
            <Text
              color={'white'}
              fontFamily="DM Sans"
              fontSize={16}
              fontWeight="normal"
            >
              %
            </Text>
          </InputRightElement>
        </InputGroup>
      </Flex>
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
        defaultValue={DEFAULT_DAO_THRESHOLD}
        width={'722px'}
        onChange={val => setThreshold(val)}
        min={1}
        max={100}
        step={1}
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
        <SliderThumb height={'32px'} position={'relative'}>
          <Box
            height="30px"
            width="55px"
            background="#7453FD"
            position="absolute"
            bottom="calc(100% + 15px)"
            left="50%"
            transform="translateX(-50%)"
            borderRadius={12}
            boxShadow="0px 3.5px 5.5px rgba(0, 0, 0, 0.02)"
            _after={{
              content: '""',
              borderTop: '13px solid #7453FD',
              borderLeft: '7.5px solid transparent',
              borderRight: '7.5px solid transparent',
              position: 'absolute',
              top: 'calc(100% - 1px)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Text
              color="#FFFFFF"
              fontFamily={'DM Sans'}
              fontWeight="400"
              fontSize={14}
              lineHeight="12px"
              textAlign="center"
              marginTop="9px"
            >
              {`${threshold} %`}
            </Text>
          </Box>
        </SliderThumb>
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
        <Text
          color={'rgba(0,0,0,0.7)'}
          fontFamily="DM Sans"
          fontSize={14}
          fontWeight="normal"
          marginLeft={'12px'}
        >
          Individual Share of Votes must not exceed % to Pass
        </Text>
        <Spacer />
        <Button
          width={'99px'}
          height={'42px'}
          variant={'link'}
          onClick={() => setCreateDaoSelected(null)}
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
                    time: 2419200, //28 days
                  },
                  members: members,
                  thresholdPercentage: threshold,
                },
                args: { fee },
              })
              .then(() => {
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
            <CircularProgress isIndeterminate size={'24px'} color="midnight" />
          )}
        </Button>
      </Flex>
    </Box>
  );
};

export default CreateDaoForm;
