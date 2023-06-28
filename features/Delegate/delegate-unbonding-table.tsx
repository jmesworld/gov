import {
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from '@chakra-ui/react';

export const DelegateUnbondingTable = () => {
  return (
    <TableContainer height={320} overflowY="scroll">
      <Table variant="unstyled" size="sm" color="white">
        <Thead>
          <Tr>
            <Th
              textTransform="none"
              paddingLeft={0}
              position="sticky"
              top={0}
              background="darkPurple"
            >
              <Text
                color="lilac"
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={14}
                lineHeight="20px"
              >
                Amount
              </Text>
            </Th>
            <Th
              textTransform="none"
              paddingRight={0}
              position="sticky"
              top={0}
              background="darkPurple"
            >
              <Text
                color="lilac"
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={14}
                lineHeight="20px"
                textAlign="right"
              >
                Available In
              </Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr borderTop="1px solid rgba(255, 255, 255, 0.12)">
            <Td paddingLeft={0}>
              <Text
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={14}
                lineHeight="20px"
              >
                200
              </Text>
            </Td>
            <Td paddingRight={0}>
              <Text
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={14}
                lineHeight="20px"
                textAlign="right"
              >
                23h:34m
              </Text>
            </Td>
          </Tr>
          <Tr borderTop="1px solid rgba(255, 255, 255, 0.12)">
            <Td paddingLeft={0}>
              <Text
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={14}
                lineHeight="20px"
              >
                150
              </Text>
            </Td>
            <Td paddingRight={0}>
              <Text
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={14}
                lineHeight="20px"
                textAlign="right"
              >
                1 days
              </Text>
            </Td>
          </Tr>
          <Tr borderTop="1px solid rgba(255, 255, 255, 0.12)">
            <Td paddingLeft={0}>
              <Text
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={14}
                lineHeight="20px"
              >
                350
              </Text>
            </Td>
            <Td paddingRight={0}>
              <Text
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={14}
                lineHeight="20px"
                textAlign="right"
              >
                2 days
              </Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
