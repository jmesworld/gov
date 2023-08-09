import { Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { ProposalResponse } from '../../client/Governance.types';
import { formatBalanceWithComma } from '../../hooks/useAccountBalance';
import { convertBlockToMonth } from '../../utils/block';
import { ProposalResponseForEmpty } from '../../client/DaoMultisig.types';
import { getFunding } from '../../utils/proposalUti';

type ProposalFundingProps = {
  proposal?: ProposalResponse;
};
type Funding = {
  amount: number;
  duration_in_blocks: number;
};

export const ProposalFunding = ({ proposal }: ProposalFundingProps) => {
  if (!proposal?.funding) return null;
  const duration = convertBlockToMonth(
    (proposal?.funding as Funding)?.duration_in_blocks,
  );
  const durationFormatted = `${duration.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })} month${duration > 1 ? 's' : ''}`;

  const fundingPerMonth =
    (proposal?.funding as Funding)?.amount !== undefined
      ? Number(
          ((proposal?.funding as Funding)?.amount ?? 0) /
            (Number(duration) || 1),
        ) ?? 0
      : undefined;
  return (
    <ProposalFundingComponent
      fundingPerMonth={fundingPerMonth}
      durationFormatted={durationFormatted}
    />
  );
};

type DaoProposalFundingProps = {
  proposal?: ProposalResponseForEmpty;
};

export const DaoProposalFunding = ({ proposal }: DaoProposalFundingProps) => {
  if (!proposal) return null;
  const fund = getFunding(proposal);
  if (!fund) return null;

  const durationInBlock = Number(fund?.duration_in_blocks);
  const duration = convertBlockToMonth(durationInBlock);
  const votingDurationNum = duration.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  const votingDuration = `${votingDurationNum} month${duration > 1 ? 's' : ''}`;

  const fundingPerMonth = (
    Number(fund?.amount || 0) / (Number(votingDurationNum) || 1)
  ).toFixed(0);

  return (
    <ProposalFundingComponent
      fundingPerMonth={Number(fundingPerMonth)}
      durationFormatted={votingDuration}
    />
  );
};

const ProposalFundingComponent = ({
  fundingPerMonth,
  durationFormatted,
}: {
  fundingPerMonth?: number;
  durationFormatted: string;
}) => {
  return (
    <Flex gap="12" pl="3" py="4">
      <Flex flexDir="column">
        <Text fontFamily="DM Sans" fontSize={12} color="lilac">
          FUNDING PER MONTH
        </Text>
        <Flex mt="1" alignItems="center">
          <Image
            cursor="pointer"
            display="inline-block"
            src="/JMES_Icon_white.svg"
            width="12px"
            height="12px"
            marginRight="4px"
            alt="jmes"
          />
          <Tooltip
            zIndex={333}
            label={formatBalanceWithComma(Number(fundingPerMonth ?? 0) || 0)}
            isDisabled={fundingPerMonth === undefined}
            hasArrow
          >
            <Text fontFamily="DM Sans" fontSize={14} color="white">
              {fundingPerMonth
                ? formatBalanceWithComma(fundingPerMonth, 0)
                : '0'}
            </Text>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex flexDir="column">
        <Text fontFamily="DM Sans" fontSize={12} color="lilac">
          FUNDING DURATION
        </Text>

        <Text fontFamily="DM Sans" mt="1" fontSize={14} color="white">
          {durationFormatted}
        </Text>
      </Flex>
    </Flex>
  );
};
