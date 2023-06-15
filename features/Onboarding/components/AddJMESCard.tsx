import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Spacer,
  Image,
  Text,
  Button,
  IconButton,
  CloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { addJMEStoKeplr } from "../../../actions/keplr";
import OnboardingProgressIndicator from "./OnboardingProgressIndicator";

const AddJMESCard = ({
  radioGroup,
  currentCard,
  setCurrentCard,
  setIsInitalizing,
}: {
  radioGroup: Array<String>;
  currentCard: String;
  setCurrentCard: Function;
  setIsInitalizing: Function;
}) => {
  const handleUpdateCard = (index: number) => {
    // const index = radioGroup.indexOf(currentCard);
    setCurrentCard(radioGroup[index + 1]);
    setIsInitalizing(false);
  };

  const handleAddJmesToKeplr = () => {
    addJMEStoKeplr()
      .then((res) => {
        console.log("success");
      })
      .catch((error) => console.log(error));
    handleUpdateCard(radioGroup.indexOf(currentCard));
  };

  return (
    <Box
      width={"500px"}
      height={"590px"}
      alignItems={"center"}
      marginTop={"-90px"}
    >
      <Flex>
        <Flex width={"100%"} justifyContent={"space-between"}>
          <Image
            marginLeft={"auto"}
            marginRight={"auto"}
            alignSelf={"center"}
            src="/JMES_Add.svg"
            alt="icon"
            width={"255px"}
            height={"311px"}
            justifySelf={"center"}
          />
        </Flex>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={"white"}
          fontFamily="DM Sans"
          fontWeight={"bold"}
          fontSize={28}
          py={"6px"}
        >
          Add JMES to Keplr Wallet
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={"white"}
          fontFamily="DM Sans"
          fontWeight={"normal"}
          fontSize={16}
        >
          Once you connect your wallet make sure you have
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={"white"}
          fontFamily="DM Sans"
          fontWeight={"normal"}
          fontSize={16}
        >
          JMES tokens so you can create a JMES identity
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={"white"}
          fontWeight={"normal"}
          fontFamily="DM Sans"
          fontSize={16}
          paddingBottom={"6px"}
        >
          and vote on Proposals.
        </Text>
        <Spacer />
      </Flex>
      <Flex py={"25px"}>
        <Spacer />
        <Button
          onClick={() => handleAddJmesToKeplr()}
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
          <Text
            color="midnight"
            fontFamily={"DM Sans"}
            fontWeight="medium"
            fontSize={14}
          >
            Add network
          </Text>
        </Button>
        <Spacer />
      </Flex>
      <Spacer />
      <OnboardingProgressIndicator activeCard="add-jmes-card" />
    </Box>
  );
};

export default AddJMESCard;
