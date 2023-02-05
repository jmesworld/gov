import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

export const NavBarButton = ({
  text,
  onClick,
  disabled,
  width,
  height,
  marginLeft,
  marginRight,
}: {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  width: string;
  height: string;
  marginLeft: string;
  marginRight: string;
}) => {
  return (
    <Button
      disabled={!!disabled ? disabled : false}
      variant={"outline"}
      borderColor={disabled ? "rgba(0,0,0,0.1)" : "rgba(161,240,196,0.7)"}
      width={width}
      height={height}
      onClick={onClick}
      marginLeft={marginLeft}
      marginRight={marginRight}
      borderRadius={50}
      backgroundColor={"transparent"}
      _hover={{ bg: "transparent" }}
      justifyContent={"start"}
      paddingLeft={"0px"}
    >
      <Flex marginLeft={"15px"} alignItems={"center"}>
        <AddIcon boxSize={"10px"} color="white" />
        <Text
          color="white"
          fontFamily={"DM Sans"}
          fontWeight="medium"
          fontSize={14}
          marginLeft={"10px"}
        >
          {text}
        </Text>
      </Flex>
    </Button>
  );
};
