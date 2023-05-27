import { Text, VStack, HStack, Tooltip, Image } from "@chakra-ui/react";
import { useEffect } from "react";

import { ProposalDaoMember } from "./proposal-dao-member";
import { m } from "framer-motion";

export const ProposalDaoMembers = ({
  selectedDaoMembersList,
}: {
  selectedDaoMembersList: Array<any>;
}) => {
  useEffect(() => {
    const init = async () => {
      const percentCircle = document.querySelector(".percentCircle");
      const percent = percentCircle?.getAttribute("data-percent");
      const percentCircleLine = percentCircle?.querySelector(".fill");

      if (percentCircleLine && percent) {
        percentCircleLine.setAttribute(
          "style",
          "stroke-dashoffset: " + ((100 - parseInt(percent)) / 100) * 229
        );
      }
    };
    init().catch(console.error);
  });

  return (
    <VStack spacing="14px" width="100%">
      <HStack width="100%">
        <Text
          textTransform="uppercase"
          color="rgba(15, 0, 86, 0.8)"
          fontSize={12}
          fontWeight="medium"
          fontFamily="DM Sans"
        >
          DAO Members
        </Text>
        <Tooltip label="Info">
          <Image
            src="/tooltip.svg"
            alt="Info"
            width={"13.33px"}
            height={"13.33px"}
          ></Image>
        </Tooltip>
      </HStack>

      {selectedDaoMembersList.map((member) => (
        <ProposalDaoMember key={member?.name} name={member?.name} percent={member?.weight} />
      ))}
    </VStack>
  );
};
