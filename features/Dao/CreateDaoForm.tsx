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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  countObjectsWithDuplicateNames,
  validateName,
} from "../../utils/identity";
import { AddIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from "../../client/Identityservice.client";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { useQuery } from "@tanstack/react-query";
import { useIdentityserviceRegisterDaoMutation } from "../../client/Identityservice.react-query";
import { StdFee } from "@cosmjs/amino";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

const fee: StdFee = {
  amount: [{ amount: "30000", denom: "ujmes" }],
  gas: "10000000",
};

const CreateDaoForm = ({
  daoOwner,
  setCreateDaoSelected,
}: {
  daoOwner: { name: string; address: string; votingPower: number };
  setCreateDaoSelected: Function;
}) => {
  const { address, status, getCosmWasmClient, getSigningCosmWasmClient } =
    useChain(chainName);
  const [daoName, setDaoName] = useState("");
  const [daoMembers, setDaoMembers] = useState([daoOwner]);
  const [threshold, setThreshold] = useState(50);
  const [isIdentityNamesValid, setIdentityNamesValid] = useState(false);
  const [focusedCosignerIndex, setFocusedCosignerIndex] = useState(Infinity);
  const [isCreatingDao, setIsCreatingDao] = useState(false);
  const [doubleCounts, setDoubleCounts] = useState(0);

  const toast = useToast();
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);

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
      console.log("update");
      getCosmWasmClient()
        .then((cosmWasmClient) => {
          if (!cosmWasmClient) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  const totalVotingPower = daoMembers.reduce(
    (sum, member) => sum + (!!member?.votingPower ? member?.votingPower : 0),
    0
  );
  const validationResult = validateName(daoName);
  const isDaoNameValid = !validationResult?.name;

  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
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
        identityAddrs[j] = "Invalid identity";
      }
    }

    if (identityAddrs.includes("Invalid identity")) {
      setIdentityNamesValid(false);
    } else {
      setIdentityNamesValid(true);
    }
    return identityAddrs;
  }

  const idsByNamesQuery = useQuery(["identities"], getIdentitiesByNames);

  const isFormValid =
    totalVotingPower === 100 &&
    isDaoNameValid &&
    threshold > 0 &&
    (isIdentityNamesValid || daoMembers.length === 1) &&
    doubleCounts === 0;

  const idClient: IdentityserviceClient = new IdentityserviceClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    IDENTITY_SERVICE_CONTRACT
  );

  const members = daoMembers.map((member) => ({
    addr: member.address,
    weight: member.votingPower,
  }));

  const registerDaoMutation = useIdentityserviceRegisterDaoMutation();

  useEffect(() => {
    const dups = countObjectsWithDuplicateNames(daoMembers);
    setDoubleCounts(dups);
  });

  return (
    <Box>
      <Text
        color={"rgba(15,0,86,0.8)"}
        fontFamily="DM Sans"
        fontSize={12}
        fontWeight="medium"
        marginBottom={"17px"}
      >
        DAO NAME
      </Text>
      <Input
        variant={"outline"}
        width={"758px"}
        height={"48px"}
        borderColor={"rgba(112,79,247,0.5)"}
        background={"rgba(112,79,247,0.1)"}
        focusBorderColor="darkPurple"
        borderRadius={12}
        color={"purple"}
        onChange={(e) => setDaoName(e.target.value)}
      />
      <Text
        marginBottom={"8px"}
        color={"rgba(0,0,0,0.7)"}
        fontFamily={"DM Sans"}
        fontWeight="normal"
        fontSize={12}
        marginLeft={"18px"}
        marginTop={"8px"}
      >
        {daoName.length > 0
          ? isDaoNameValid
            ? ""
            : validationResult.message
          : ""}
      </Text>
      <Flex width={"758px"} marginTop={"38px"} marginBottom={"19px"}>
        <Button
          variant={"outline"}
          borderColor={"purple"}
          width={"126px"}
          height={"48px"}
          onClick={() => {
            setDaoMembers([
              ...daoMembers,
              { name: "", address: "", votingPower: 0 },
            ]);
          }}
          borderRadius={50}
          backgroundColor={"transparent"}
          _hover={{ bg: "transparent" }}
          justifyContent={"start"}
        >
          <Flex marginLeft={"0px"} alignItems={"center"}>
            <AddIcon boxSize={"10px"} color="purple" />
            <Text
              color="purple"
              fontWeight="medium"
              fontSize={14}
              marginLeft={"10px"}
              fontFamily="DM Sans"
            >
              Cosigner
            </Text>
          </Flex>
        </Button>
        <Box width={"8px"} />
        <Button
          variant={"outline"}
          borderColor={"purple"}
          width={"126px"}
          height={"48px"}
          onClick={() => {
            const power = 100 / daoMembers.length;
            daoMembers.forEach((member) => (member.votingPower = power));
            setDaoMembers(daoMembers);
          }}
          borderRadius={50}
          backgroundColor={"transparent"}
          _hover={{ bg: "transparent" }}
          justifyContent={"center"}
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
          color={"rgba(15,0,86,0.8)"}
          fontFamily="DM Sans"
          fontSize={12}
          fontWeight="medium"
          marginBottom={"17px"}
          marginRight={"50px"}
          alignSelf={"center"}
        >
          SHARE OF VOTES
        </Text>
      </Flex>
      {daoMembers.map((daoMember, index) => (
        <Flex key={index} marginBottom={"16px"}>
          <InputGroup width={"610px"} height={"48px"}>
            <Input
              isReadOnly={index === 0}
              variant={"outline"}
              borderColor={"rgba(112,79,247,0.5)"}
              background={"rgba(112,79,247,0.1)"}
              focusBorderColor="darkPurple"
              borderRadius={12}
              marginRight={"16px"}
              color={"darkPurple"}
              height={"100%"}
              defaultValue={daoMember?.name}
              fontWeight={"normal"}
              onChange={(e) => {
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
              justifyContent={"start"}
              height={"100%"}
            >
              <Text
                color={"purple"}
                fontFamily="DM Sans"
                fontSize={16}
                fontWeight="normal"
              >
                {index > 0
                  ? !validateName(daoMember?.name)?.name
                    ? !idsByNamesQuery.isFetching
                      ? idsByNamesQuery?.data?.at(index)
                      : index === focusedCosignerIndex
                      ? "Checking..."
                      : idsByNamesQuery?.data?.at(index)
                    : ""
                  : daoMember.address}
              </Text>
            </InputRightElement>
          </InputGroup>
          <InputGroup width={"102px"} height={"48px"} marginRight={"16px"}>
            <Input
              variant={"outline"}
              width={"102px"}
              height={"100%"}
              borderColor={"rgba(112,79,247,0.5)"}
              background={"rgba(112,79,247,0.1)"}
              focusBorderColor="darkPurple"
              borderRadius={12}
              color={"purple"}
              fontWeight={"normal"}
              value={daoMember?.votingPower}
              type={"number"}
              onChange={(e) => {
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

            <InputRightElement height={"100%"}>
              <Text
                color={"purple"}
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
              size={"24px"}
              _hover={{ backgroundColor: "transparent" }}
              color={"rgba(15,0,86,0.3)"}
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
        marginTop={"16px"}
        height={"48px"}
        alignItems={"center"}
        width={"758px"}
      >
        <QuestionOutlineIcon
          width={"16px"}
          height={"16px"}
          color={"rgba(0,0,0,0.4)"}
        />
        <Text
          color={"rgba(0,0,0,0.7)"}
          fontFamily="DM Sans"
          fontSize={14}
          fontWeight="normal"
          marginLeft={"12px"}
        >
          Total Share of Votes must equal 100%
        </Text>
        <Spacer />
        <InputGroup width={"102px"} height={"48px"} marginRight={"44px"}>
          <Input
            variant={"outline"}
            width={"102px"}
            height={"100%"}
            borderColor={"rgba(112,79,247,0.5)"}
            background={totalVotingPower === 100 ? "purple" : "red"}
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={"white"}
            fontWeight={"normal"}
            value={totalVotingPower}
          />

          <InputRightElement height={"100%"}>
            <Text
              color={"white"}
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
        marginBottom={"8px"}
        color={"red"}
        fontFamily={"DM Sans"}
        fontWeight="normal"
        fontSize={18}
        marginLeft={"12px"}
        marginTop={"8px"}
      >
        {doubleCounts > 0
          ? "Single member identity entered more than once!"
          : ""}
      </Text>
      <Text
        marginTop={"93px"}
        color={"rgba(15,0,86,0.8)"}
        fontFamily="DM Sans"
        fontSize={12}
        fontWeight="medium"
        marginBottom={"8px"}
      >
        % TO PASS
      </Text>
      <Slider
        aria-label="dao-proposal-threshold"
        defaultValue={50}
        width={"722px"}
        onChange={(val) => setThreshold(val)}
      >
        <SliderTrack
          height={"16px"}
          borderRadius={"10px"}
          backgroundColor={"rgba(112,79,247,0.1)"}
          borderColor={"rgba(112,79,247,0.5)"}
          borderWidth={"1px"}
        >
          <SliderFilledTrack backgroundColor={"green"} />
        </SliderTrack>
        <Tooltip
          isOpen
          hasArrow={true}
          label={`${threshold} %`}
          bg={"purple"}
          color={"white"}
          direction={"rtl"}
          placement={"top"}
          borderRadius={"10px"}
        >
          <SliderThumb height={"32px"} />
        </Tooltip>
      </Slider>
      <Flex
        marginTop={"12px"}
        marginBottom={"93px"}
        height={"48px"}
        alignItems={"center"}
        width={"100%"}
      >
        <QuestionOutlineIcon
          width={"16px"}
          height={"16px"}
          color={"rgba(0,0,0,0.4)"}
        />
        <Text
          color={"rgba(0,0,0,0.7)"}
          fontFamily="DM Sans"
          fontSize={14}
          fontWeight="normal"
          marginLeft={"12px"}
        >
          Individual Share of Votes must not exceed % to Pass
        </Text>
        <Spacer />
        <Button
          width={"99px"}
          height={"42px"}
          variant={"link"}
          onClick={() => setCreateDaoSelected(false)}
        >
          <Text
            color={"darkPurple"}
            fontFamily="DM Sans"
            fontSize={14}
            fontWeight="medium"
            style={{ textDecoration: "underline" }}
          >
            Cancel
          </Text>
        </Button>
        <Box width={"12px"} />
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
                  thresholdPercentage: (threshold / 100).toString(),
                },
                args: { fee },
              })
              .then((result) => {
                toast({
                  title: "Dao created.",
                  description:
                    "We've created your Dao for you. You'll be able to access it shortly.",
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
                  title: "Dao creation error",
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
              .finally(() => setIsCreatingDao(false));
          }}
          backgroundColor={"green"}
          borderRadius={90}
          alignContent="end"
          width={"148px"}
          height={"42px"}
          alignSelf="center"
          _hover={{ bg: "green" }}
          variant={"outline"}
          borderWidth={"1px"}
          borderColor={"rgba(0,0,0,0.1)"}
        >
          {!isCreatingDao ? (
            <Text
              color="midnight"
              fontFamily={"DM Sans"}
              fontWeight="medium"
              fontSize={14}
            >
              Create
            </Text>
          ) : (
            <CircularProgress isIndeterminate size={"24px"} color="midnight" />
          )}
        </Button>
      </Flex>
    </Box>
  );
};

export default CreateDaoForm;
