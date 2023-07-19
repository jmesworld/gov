import { Text, Box, Image, Spinner, Alert, Tooltip } from '@chakra-ui/react';
import { Core } from 'jmes';
import {
  formatBalance,
  formatBalanceWithComma,
} from '../../hooks/useAccountBalance';

interface ValidatorProps {
  validatorsData?: Core.Validator[];
  selectedValidator: string | null;
  onSelectValidator: (id: string | null) => void;
  error: Error | undefined;
  validatorsMap: Map<string, Core.Validator> | null;
  loading: boolean;
}
export const DelegateValidatorTable = ({
  validatorsData,
  onSelectValidator,
  selectedValidator,
  validatorsMap,
  error,
  loading,
}: ValidatorProps) => {
  return (
    <Box position="relative" height="380px" overflowY="scroll">
      <Box
        width="100%"
        position="sticky"
        top="0"
        background="#5136C2"
        zIndex="99"
        padding="20px 0 10px"
      >
        <Text
          color="#fff"
          fontFamily={'DM Sans'}
          fontWeight="500"
          fontSize={12}
        >
          Select a validator to bond to
        </Text>
      </Box>

      <Box
        display="flex"
        justifyContent="flex-start"
        padding="8px 0"
        position="sticky"
        top="48px"
        background="#5136C2"
        zIndex="99"
      >
        <Text
          color="lilac"
          fontFamily={'DM Sans'}
          fontWeight="500"
          fontSize={12}
          lineHeight="20px"
          width="36%"
        >
          Name
        </Text>
        <Text
          color="lilac"
          fontFamily={'DM Sans'}
          fontWeight="500"
          fontSize={12}
          lineHeight="20px"
          width="30%"
        >
          Commission
        </Text>
        <Text
          color="lilac"
          fontFamily={'DM Sans'}
          fontWeight="500"
          fontSize={12}
          lineHeight="20px"
          width="30%"
        >
          Voting Power
        </Text>
      </Box>
      {!validatorsData && error && (
        <Alert status="error" title={error.message} />
      )}
      {loading && <Spinner size="sm" />}
      {validatorsData?.map(validator => {
        const id = validator.operator_address;
        const validatorCoreData = validatorsMap?.get(id);
        return (
          <Box
            key={id}
            onClick={() => onSelectValidator(id)}
            display="flex"
            justifyContent="flex-start"
            padding={selectedValidator === id ? '8px' : '8px 0'}
            background={selectedValidator === id ? '#704FF7' : ''}
            borderRadius={validator.operator_address === id ? '4px' : ''}
            cursor="pointer"
          >
            <Text
              color="#fff"
              fontFamily={'DM Sans'}
              fontWeight="500"
              fontSize={12}
              lineHeight="20px"
              width="36%"
            >
              {validator.description.moniker}
            </Text>
            <Text
              color="#fff"
              fontFamily={'DM Sans'}
              fontWeight="500"
              fontSize={12}
              lineHeight="20px"
              width="30%"
            >
              {validator.commission.commission_rates.rate
                .toDecimalPlaces(2)
                .toString()}
              %
            </Text>
            <Tooltip
              label={formatBalanceWithComma(
                validatorCoreData?.tokens.dividedBy(1e6).toNumber() || 0,
              )}
            >
              <Text
                color="#fff"
                fontFamily={'DM Sans'}
                fontWeight="500"
                fontSize={12}
                lineHeight="20px"
                width="30%"
              >
                {formatBalance(
                  validatorCoreData?.delegator_shares.dividedBy(1e6).toNumber(),
                )}
              </Text>
            </Tooltip>
            {validator.description.website && (
              <Box width="4%">
                <a
                  href={validator.description.website}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Image
                    src="/link.svg"
                    alt="external link"
                    width={'12px'}
                    height={'12px'}
                    margin="3px 0"
                  />
                </a>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
