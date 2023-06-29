import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  Spacer,
  Text,
} from '@chakra-ui/react';

import {
  Suspense,
  Dispatch,
  SetStateAction,
  ReactNode,
  useMemo,
  memo,
} from 'react';
import { IdentityserviceQueryClient } from '../../../client/Identityservice.client';
import OnboardingProgressIndicator from '../components/OnboardingProgressIndicator';
import { useIdentityserviceGetIdentityByNameQuery } from '../../../client/Identityservice.react-query';
import { validateName } from '../../../utils/identity';

// eslint-disable-next-line react/display-name
export const SearchResults = memo(
  ({
    query,
    client,
    setIsIdentityNameAvailable,
  }: {
    query: string;
    client: IdentityserviceQueryClient;
    setIsIdentityNameAvailable: Dispatch<SetStateAction<boolean>>;
  }) => {
    const nameInvalid = useMemo(() => validateName(query), [query]);

    const { data, isLoading, error } = useIdentityserviceGetIdentityByNameQuery(
      {
        client,
        args: { name: query },

        options: {
          enabled: !nameInvalid,
          staleTime: 1000,
          cacheTime: 1000,
          retry: 3,
          refetchOnReconnect: true,
          onError() {
            setIsIdentityNameAvailable(false);
          },
          onSuccess: data => {
            if (!nameInvalid)
              setIsIdentityNameAvailable(!data?.identity?.name.toString());
            else setIsIdentityNameAvailable(false);
          },
        },
      },
    );
    if (isLoading) {
      <Text> Loading... </Text>;
    }
    if (error) {
      <Text> Error: {error.message} </Text>;
    }
    return (
      <Text
        marginBottom={'8px'}
        color="white"
        fontFamily={'DM Sans'}
        fontWeight="normal"
        fontSize={12}
        marginLeft={'18px'}
        marginTop={'8px'}
      >
        {query && nameInvalid && (
          <Text
            color={
              ['NameTooLong', 'NameTooShort'].includes(nameInvalid.name)
                ? 'orange'
                : 'red'
            }
          >
            {nameInvalid.message}
          </Text>
        )}

        {data?.identity?.name.toString() === query && !nameInvalid && (
          <Text color="red">Name taken!</Text>
        )}

        {query && !nameInvalid && data?.identity?.name.toString() !== query && (
          <Text color="green">Name is available!</Text>
        )}
      </Text>
    );
  },
);

type ChooseUsernameCardComponentProps = {
  onDisconnect: () => void;
  usernameInputDisabled: boolean;
  usernameInput: string;
  onUsernameChange: (username: string) => void;
  onUsernameInputBlur: () => void;
  showInputCheckIcon: boolean;
  isCreatingIdentity: boolean;
  searchComponent: ReactNode;
  createIdentityDisabled: boolean;
  onIdentityCreateClick: () => void;
};

export const ChooseUsernameCardComponent = ({
  onDisconnect,
  usernameInputDisabled,
  usernameInput,
  onUsernameChange,
  onUsernameInputBlur,
  showInputCheckIcon,
  searchComponent,
  createIdentityDisabled,
  onIdentityCreateClick,
  isCreatingIdentity,
}: ChooseUsernameCardComponentProps) => {
  return (
    <Modal
      isOpen={true}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClose={() => {}}
      isCentered={true}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalContent
        maxW="500px"
        maxH="675px"
        alignItems={'center'}
        borderRadius={'12px'}
      >
        <ModalBody
          backgroundColor={'#704FF7'}
          width={'500px'}
          height={'500px'}
          borderRadius={'12px'}
        >
          <Box
            width={'500px'}
            height={'590px'}
            alignItems={'center'}
            marginTop={'-52.75px'}
          >
            <Flex>
              <Flex
                width={'100%'}
                justifyContent={'space-between'}
                marginRight={'40px'}
              >
                <Spacer />
                <Image
                  src="/Computer.svg"
                  alt="icon"
                  width={'288px'}
                  height={'275.8px'}
                  justifySelf={'center'}
                />
                <Spacer />
                <IconButton
                  aria-label=""
                  background={'transparent'}
                  color={'white'}
                  icon={<CloseIcon height={'24px'} />}
                  marginTop={'62.75px'}
                  marginRight={'8px'}
                  _hover={{ backgroundColor: 'transparent' }}
                  onClick={() => {
                    onDisconnect();
                  }}
                />
              </Flex>

              <Spacer />
            </Flex>
            <Flex marginRight={'40px'}>
              <Spacer />
              <Text
                color={'white'}
                fontWeight={'bold'}
                fontSize={28}
                marginTop={'4px'}
                fontFamily="DM Sans"
              >
                Choose a username
              </Text>
              <Spacer />
            </Flex>
            <Flex marginTop={'24px'} marginRight={'40px'}>
              <Spacer />
              <Box>
                <InputGroup justifyItems={'center'}>
                  <Input
                    autoFocus
                    placeholder="Username"
                    disabled={usernameInputDisabled}
                    width={'398px'}
                    height={'49px'}
                    backgroundColor="#5136C2"
                    borderColor="#5136C2"
                    borderRadius={12}
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontFamily="DM Sans"
                    fontSize={'16px'}
                    fontWeight="normal"
                    value={usernameInput}
                    onChange={e => onUsernameChange(e.target.value)}
                    onBlur={onUsernameInputBlur}
                  />
                  <InputRightElement marginTop={'4px'}>
                    {showInputCheckIcon && <CheckIcon color={'green'} />}
                  </InputRightElement>
                </InputGroup>
                <Suspense fallback={<div>Loading...</div>}>
                  {searchComponent}
                </Suspense>
              </Box>
              <Spacer />
            </Flex>
            <Flex marginTop={'11px'} marginBottom={'25px'} marginRight={'40px'}>
              <Spacer />
              <Button
                disabled={createIdentityDisabled}
                // onClick={async () => await handleCreateIdentity()}
                onClick={onIdentityCreateClick}
                backgroundColor={'green'}
                borderRadius={90}
                alignContent="end"
                width={'200px'}
                height={'48px'}
                _hover={{ bg: 'green' }}
                _active={{ bg: 'green' }}
                variant={'outline'}
                borderWidth={'1px'}
                borderColor={'rgba(0,0,0,0.1)'}
              >
                {!isCreatingIdentity ? (
                  <Text
                    color="midnight"
                    fontFamily={'DM Sans'}
                    fontWeight="medium"
                    fontSize={14}
                  >
                    Create Identity
                  </Text>
                ) : (
                  <CircularProgress
                    isIndeterminate
                    size={'24px'}
                    color="midnight"
                  />
                )}
              </Button>
              <Spacer />
            </Flex>
            <Spacer />
            <Box marginRight={'40px'}>
              <OnboardingProgressIndicator activeCard="choose-username-card" />
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
