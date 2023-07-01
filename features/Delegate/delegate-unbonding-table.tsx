import {
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Spinner,
} from '@chakra-ui/react';
import { UnbondingDelegation } from 'jmes/build/Client/providers/LCDClient/core';

type Props = {
  unBondingsData?: UnbondingDelegation[];
  unBondingsError: Error | undefined;
  isLoadingUnBondings: boolean;
};
export const DelegateUnbondingTable = ({
  unBondingsData,
  isLoadingUnBondings,
}: Props) => {
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
          {isLoadingUnBondings && <Spinner size="sm" color="white" />}
          {unBondingsData?.map(el => (
            <Tr
              key={el.validator_address}
              borderTop="1px solid rgba(255, 255, 255, 0.12)"
            >
              <Td paddingLeft={0}>
                <Text
                  fontFamily={'DM Sans'}
                  fontWeight="500"
                  fontSize={14}
                  lineHeight="20px"
                >
                  {el.entries.map(a => (
                    <p key={a.completion_time.toString()}>
                      {' '}
                      {a.balance.toString()}{' '}
                    </p>
                  ))}
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
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
