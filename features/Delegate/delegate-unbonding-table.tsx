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
  Tooltip,
} from '@chakra-ui/react';
import { UnbondingDelegation } from 'jmes/build/Client/providers/LCDClient/core';
import {
  formatBalance,
  formatBalanceWithComma,
} from '../../hooks/useAccountBalance';
import moment from 'moment';

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
            <>
              {el.entries.map(a => (
                <Tr key={a.creation_height}>
                  <Td px="0">
                    <Tooltip
                      hasArrow
                      label={formatBalanceWithComma(
                        a.balance.dividedBy(1e6).toDecimalPlaces(6).toNumber(),
                      )}
                    >
                      <Text
                        fontFamily={'DM Sans'}
                        fontWeight="500"
                        fontSize={12}
                        lineHeight="20px"
                        key={a.completion_time.toString()}
                      >
                        {formatBalance(a.balance.dividedBy(1e6).toNumber())}
                      </Text>
                    </Tooltip>
                  </Td>
                  <Td textAlign="right" px="0">
                    <Text
                      fontFamily={'DM Sans'}
                      fontWeight="500"
                      fontSize={12}
                      lineHeight="20px"
                    >
                      {moment(a.completion_time).fromNow()}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
