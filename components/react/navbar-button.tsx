import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

export const NavBarButton = ({
  text,
  onClick,
  disabled,
  width,
  height,
}: {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  width: string;
  height: string;
}) => {
  return (
    <Flex width={"100%"} paddingLeft={"10px"}>
      <Button
        disabled={!!disabled ? disabled : false}
        variant={"outline"}
        borderColor={disabled ? "rgba(161,240,196,0.7)" : "green"}
        width={width}
        height={height}
        onClick={onClick}
        borderRadius={50}
        backgroundColor={"transparent"}
        _hover={{ bg: "transparent" }}
        justifyContent={"start"}
      >
        <Flex marginLeft={"0px"} alignItems={"center"}>
          <AddIcon boxSize={"10px"} color="white" />
          <Text
            color="white"
            fontWeight="medium"
            fontSize={14}
            marginLeft={"10px"}
            fontFamily="DM Sans"
          >
            {text}
          </Text>
        </Flex>
      </Button>
    </Flex>
  );
};
