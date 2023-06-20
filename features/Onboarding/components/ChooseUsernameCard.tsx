import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
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
  useToast,
} from "@chakra-ui/react";

import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

import { useChain } from "@cosmos-kit/react";
import { useEffect, useState, useDeferredValue, Suspense } from "react";
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from "../../../client/Identityservice.client";
import { chainName } from "../../../config/defaults";
import OnboardingProgressIndicator from "./OnboardingProgressIndicator";
import { StdFee } from "@cosmjs/stargate";
import { WalletStatus } from "@cosmos-kit/core";
import {
  useIdentityserviceGetIdentityByNameQuery,
  useIdentityserviceRegisterUserMutation,
} from "../../../client/Identityservice.react-query";
import { IdentityError, validateName } from "../../../utils/identity";
import { useClientIdentity } from "../../../hooks/useClientIdentity";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

const fee: StdFee = {
  amount: [
    {
      denom: "ujmes",
      amount: "2",
    },
  ],
  gas: "1000000",
};
interface ChooseUsernameCardProps {
  identityName: String;
  isOpen: any;
}

const ChooseUsernameCard = ({
  identityName,
  isOpen,
}: ChooseUsernameCardProps) => {
  const [identityNameInput, setIdentityNameInput] = useState("");
  const [isIdentityNameAvailable, setIsIdentityNameAvailable] = useState(false);
  const [isCreatingIdentity, setIsCreatingIdentity] = useState(false);
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);
  const chainContext = useChain(chainName);

  const { address, status, getCosmWasmClient, getSigningCosmWasmClient } =
    chainContext;

  const toast = useToast();
  const { disconnect, identityOwnerQuery } = useClientIdentity();

  useEffect(() => {
    if (identityName?.length > 0) {
      setIdentityNameInput(identityName as string);
      setTimeout(() => {}, 2000);
    }
  }, [identityName]);

  // useEffect(() => {
  //   if (address) {
  //     getCosmWasmClient()
  //       .then((cosmWasmClient) => {
  //         if (!cosmWasmClient || !address) {
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
    console.log("address", address);
    if (address) {
      (async () => {
        try {
          const cosmWasmClient = await getCosmWasmClient();
          setCosmWasmClient(cosmWasmClient);
        } catch (error) {
          console.log(error);
        }

        try {
          const signingClient = await getSigningCosmWasmClient();
          setSigningClient(signingClient);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [address]);

  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const idClient: IdentityserviceClient = new IdentityserviceClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    IDENTITY_SERVICE_CONTRACT
  );
  const identityMutation = useIdentityserviceRegisterUserMutation();
  const identityNameQuery = useIdentityserviceGetIdentityByNameQuery({
    client,
    args: { name: identityNameInput },
    options: {
      onSuccess: (data) => {
        if (!!!data?.identity?.name.toString()) {
          setIsIdentityNameAvailable(true);
        }
      },
      onError: (error) => {
        console.log(error); //this error
      },
      cacheTime: 0,
      enabled: identityNameInput?.length > 2,
    },
  });

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const validationResult: void | IdentityError =
    validateName(identityNameInput);

  const SearchResults = ({ query }: { query: string }) => {
    const { data } = useIdentityserviceGetIdentityByNameQuery({
      client,
      args: { name: query },
      options: {
        onSuccess: (data) => {
          const isLowerCaseLettersOnly = /^[a-z]+$/.test(query);
          setIsIdentityNameAvailable(
            isLowerCaseLettersOnly &&
              query.length >= 3 &&
              !data?.identity?.name.toString()
          );
        },
      },
    });

    const isLowerCaseLettersOnly = /^[a-z]+$/.test(query);

    return (
      <>
        {query && !isLowerCaseLettersOnly ? (
          <Text color="red">
            Invalid character! Lowercase letters only please.
          </Text>
        ) : query && query.length < 3 ? (
          <Text color="orange">
            Name too short! Minimum 3 characters required.
          </Text>
        ) : data?.identity?.name.toString() === query ? (
          <Text color="red">Name taken!</Text>
        ) : query ? (
          <Text color="green">Name is available!</Text>
        ) : null}
      </>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      isCentered={true}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalContent
        maxW="500px"
        maxH="675px"
        alignItems={"center"}
        borderRadius={"12px"}
      >
        <ModalBody
          backgroundColor={"#704FF7"}
          width={"500px"}
          height={"500px"}
          borderRadius={"12px"}
        >
          <Box
            width={"500px"}
            height={"590px"}
            alignItems={"center"}
            marginTop={"-52.75px"}
          >
            <Flex>
              <Flex
                width={"100%"}
                justifyContent={"space-between"}
                marginRight={"40px"}
              >
                <Spacer />
                <Image
                  src="/Computer.svg"
                  alt="icon"
                  width={"288px"}
                  height={"275.8px"}
                  justifySelf={"center"}
                />
                <Spacer />
                <IconButton
                  aria-label=""
                  background={"transparent"}
                  color={"white"}
                  icon={<CloseIcon height={"24px"} />}
                  marginTop={"62.75px"}
                  marginRight={"8px"}
                  _hover={{ backgroundColor: "transparent" }}
                  onClick={() => {
                    disconnect();
                    window.location.reload();
                    window.localStorage.clear();
                  }}
                />
              </Flex>

              <Spacer />
            </Flex>
            <Flex marginRight={"40px"}>
              <Spacer />
              <Text
                color={"white"}
                fontWeight={"bold"}
                fontSize={28}
                marginTop={"4px"}
                fontFamily="DM Sans"
              >
                Choose a username
              </Text>
              <Spacer />
            </Flex>
            <Flex marginTop={"24px"} marginRight={"40px"}>
              <Spacer />
              <Box>
                <InputGroup justifyItems={"center"}>
                  <Input
                    disabled={status === WalletStatus.Connected ? false : true}
                    width={"398px"}
                    height={"49px"}
                    backgroundColor="#5136C2"
                    borderColor="#5136C2"
                    borderRadius={12}
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontFamily="DM Sans"
                    fontSize={"16px"}
                    fontWeight="normal"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => {
                      identityNameQuery.refetch();
                    }}
                  />
                  <InputRightElement marginTop={"4px"}>
                    {!!identityName &&
                    identityNameQuery?.data?.identity?.name.toString() !==
                      identityName ? (
                      <CheckIcon color={"green"} />
                    ) : (
                      <></>
                    )}
                  </InputRightElement>
                </InputGroup>
                <Suspense fallback={<div>Loading...</div>}>
                  <Text
                    marginBottom={"8px"}
                    color="white"
                    fontFamily={"DM Sans"}
                    fontWeight="normal"
                    fontSize={12}
                    marginLeft={"18px"}
                    marginTop={"8px"}
                  >
                    <div>
                      <SearchResults query={deferredQuery} />
                    </div>
                  </Text>
                </Suspense>
              </Box>
              <Spacer />
            </Flex>
            <Flex marginTop={"11px"} marginBottom={"25px"} marginRight={"40px"}>
              <Spacer />
              <Button
                disabled={!isIdentityNameAvailable}
                // onClick={async () => await handleCreateIdentity()}
                onClick={() => {
                  setIsCreatingIdentity(true);
                  identityMutation
                    .mutateAsync({
                      client: idClient,
                      msg: {
                        name: identityNameInput,
                      },
                      args: { fee },
                    })
                    .then((result) => {
                      toast({
                        title: "Identity created.",
                        description: "We've created your Identity for you.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                        containerStyle: {
                          backgroundColor: "darkPurple",
                          borderRadius: 12,
                        },
                      });
                    })
                    .catch((error) => {
                      toast({
                        title: "Identity creation error",
                        description: error.toString(),
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                        containerStyle: {
                          backgroundColor: "red",
                          borderRadius: 12,
                        },
                      });
                    })
                    .finally(() => setIsCreatingIdentity(false));
                }}
                backgroundColor={"green"}
                borderRadius={90}
                alignContent="end"
                width={"200px"}
                height={"48px"}
                _hover={{ bg: "green" }}
                _active={{ bg: "green" }}
                variant={"outline"}
                borderWidth={"1px"}
                borderColor={"rgba(0,0,0,0.1)"}
              >
                {!isCreatingIdentity ? (
                  <Text
                    color="midnight"
                    fontFamily={"DM Sans"}
                    fontWeight="medium"
                    fontSize={14}
                  >
                    Create Identity
                  </Text>
                ) : (
                  <CircularProgress
                    isIndeterminate
                    size={"24px"}
                    color="midnight"
                  />
                )}
              </Button>
              <Spacer />
            </Flex>
            <Spacer />
            <Box marginRight={"40px"}>
              <OnboardingProgressIndicator activeCard="choose-username-card" />
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChooseUsernameCard;
