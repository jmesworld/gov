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
  ModalBody,
  ModalContent,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { z } from 'zod';
import { Suspense, Dispatch, SetStateAction, ReactNode, memo } from 'react';
import { IdentityserviceQueryClient } from '../../../client/Identityservice.client';
import OnboardingProgressIndicator from '../components/OnboardingProgressIndicator';
import { useIdentityserviceGetIdentityByNameQuery } from '../../../client/Identityservice.react-query';
import { allowedCharacters } from '../../../utils/numberValidators';

const nameSchemaForEachChar = z.string().regex(/^[a-z0-9]+$/);
const capitalNameSchema = z.string().regex(/^[A-Z]+$/);

// eslint-disable-next-line react/display-name
export const SearchResults = memo(
  ({
    query,
    client,
    setIsIdentityNameAvailable,
    isIdentityNameAvailable,
    queryError,
  }: {
    query: string;
    client: IdentityserviceQueryClient;
    setIsIdentityNameAvailable: Dispatch<SetStateAction<boolean>>;
    queryError: string;
    isIdentityNameAvailable: boolean;
  }) => {
    const { data, isFetching, error } =
      useIdentityserviceGetIdentityByNameQuery({
        client,
        args: { name: query },

        options: {
          enabled: !queryError && query !== '',
          staleTime: 1000,
          cacheTime: 1000,
          retry: 3,
          refetchOnReconnect: true,
          onError() {
            setIsIdentityNameAvailable(false);
          },
          onSuccess: data => {
            if (!queryError)
              setIsIdentityNameAvailable(!data?.identity?.name.toString());
            else setIsIdentityNameAvailable(false);
          },
        },
      });

    const isLoadingOrFetching = isFetching;

    if (isLoadingOrFetching) {
      return (
        <Text
          marginBottom={'8px'}
          color="white"
          fontFamily={'DM Sans'}
          fontWeight="normal"
          fontSize={12}
          height={'16px'}
          marginLeft={'18px'}
          marginTop={'8px'}
        >
          <Text>Checking name availability...</Text>
        </Text>
      );
    }

    if (error || queryError) {
      return (
        <Text
          marginBottom={'8px'}
          color="white"
          fontFamily={'DM Sans'}
          fontWeight="normal"
          fontSize={12}
          height={'16px'}
          marginLeft={'18px'}
          marginTop={'8px'}
        >
          <Text color="red"> {queryError || error?.message}</Text>
        </Text>
      );
    }

    if (
      data?.identity?.name.toString() === query &&
      !isLoadingOrFetching &&
      !queryError
    ) {
      return (
        <Text
          marginBottom={'8px'}
          color="white"
          fontFamily={'DM Sans'}
          fontWeight="normal"
          fontSize={12}
          height={'16px'}
          marginLeft={'18px'}
          marginTop={'8px'}
        >
          <Text color="red">Name taken!</Text>
        </Text>
      );
    }

    if (isIdentityNameAvailable) {
      return (
        <Text
          marginBottom={'8px'}
          color="white"
          fontFamily={'DM Sans'}
          fontWeight="normal"
          fontSize={12}
          height={'16px'}
          marginLeft={'18px'}
          marginTop={'8px'}
        >
          <Text color="green">Name is available!</Text>
        </Text>
      );
    }

    return (
      <Text
        marginBottom={'8px'}
        color="white"
        fontFamily={'DM Sans'}
        fontWeight="normal"
        fontSize={12}
        height={'16px'}
        marginLeft={'18px'}
        marginTop={'8px'}
      ></Text>
    );
  },
);

type ChooseUsernameCardComponentProps = {
  onDisconnect: () => void;
  usernameInputDisabled: boolean;
  usernameInput: string;
  onUsernameChange: (username: string) => void;
  showInputCheckIcon: boolean;
  isCreatingIdentity: boolean;
  searchComponent: ReactNode;
  createIdentityDisabled: boolean;
  onIdentityCreateClick: () => void;
};
// TODO: refactor this element we don't need to use modal body or content here
export const ChooseUsernameCardComponent = ({
  onDisconnect,
  usernameInputDisabled,
  usernameInput,
  onUsernameChange,
  showInputCheckIcon,
  searchComponent,
  createIdentityDisabled,
  onIdentityCreateClick,
  isCreatingIdentity,
}: ChooseUsernameCardComponentProps) => {
  return (
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
          width={'full'}
          height={'590px'}
          alignItems={'center'}
          marginTop={'-52.75px'}
        >
          <Flex>
            <Flex width={'100%'} justifyContent={'space-between'}>
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
          <Flex>
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
          <Flex marginTop={'24px'}>
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
                  onKeyDown={e => {
                    const character = e.key;
                    if (allowedCharacters.includes('Backspace')) {
                      return;
                    }
                    if (character === ' ' || character === 'Spacebar') {
                      e.preventDefault();
                    }

                    if (character === 'Enter') {
                      onIdentityCreateClick();
                    }

                    const name = nameSchemaForEachChar.safeParse(character);
                    const capitalName = capitalNameSchema.safeParse(character);

                    if (capitalName.success) {
                      e.preventDefault();
                      onUsernameChange(usernameInput + character.toLowerCase());
                    }
                    if (!name.success) {
                      e.preventDefault();
                    }
                  }}
                  onChange={e => onUsernameChange(e.target.value)}
                />
                <InputRightElement marginTop={'4px'}>
                  {showInputCheckIcon && <CheckIcon color={'green'} />}
                </InputRightElement>
              </InputGroup>
              <Suspense fallback={<Spinner size="sm" />}>
                {searchComponent}
              </Suspense>
            </Box>
            <Spacer />
          </Flex>
          <Flex flexDir="column" w="full" justifyContent="center">
            <Flex
              marginTop={'11px'}
              w="full"
              justifyContent="center"
              marginBottom={'25px'}
            >
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
            </Flex>

            <OnboardingProgressIndicator activeCard="choose-username-card" />
          </Flex>
        </Box>
      </ModalBody>
    </ModalContent>
  );
};
