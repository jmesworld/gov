import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Spacer,
  Text,
} from '@chakra-ui/react';

import { formatDuration, timestampToDateTime } from '../../../utils/time';
import { useVotingPeriodContext } from '../../../contexts/VotingPeriodContext';

const NEXT_PUBLIC_GOVERNANCE_CONTRACT =
  process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT;

export default function PeriodInfo() {
  const { data, nextPeriodTimeLeft, loading } = useVotingPeriodContext();
  if (!NEXT_PUBLIC_GOVERNANCE_CONTRACT) {
    throw new Error('Public Governance Contract not found!');
  }

  const current_period = data?.current_period;
  const next_voting_start = data?.next_voting_start;
  const next_posting_start = data?.next_posting_start;
  const current_block = data?.current_block;
  const current_posting_start = data?.current_posting_start;
  const current_time_in_cycle = formatDuration(
    data?.current_time_in_cycle as number,
  );
  const current_voting_start = data?.current_voting_start;
  const current_voting_end = data?.current_voting_end;
  const cycle_length = formatDuration(data?.cycle_length as number);
  const posting_period_length = formatDuration(
    data?.posting_period_length as number,
  );
  const voting_period_length = formatDuration(
    data?.voting_period_length as number,
  );

  if (loading && !data) {
    return <Skeleton width="380px" height="48px" borderRadius="90px" />;
  }

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            disabled={data ? false : true}
            as={Button}
            rightIcon={
              isOpen ? (
                <ChevronUpIcon
                  alignSelf={'center'}
                  width={'24px'}
                  height={'24px'}
                  color={current_period === 'posting' ? '#7453FD' : '#C6B4FC'}
                />
              ) : (
                <ChevronDownIcon
                  alignSelf={'center'}
                  width={'24px'}
                  height={'24px'}
                  color={current_period === 'posting' ? '#7453FD' : '#C6B4FC'}
                />
              )
            }
            width={'373px'}
            height={'48px'}
            _hover={{
              bg: current_period === 'posting' ? 'lightLilac' : 'darkPurple',
            }}
            _expanded={{
              bg: current_period === 'posting' ? 'lightLilac' : 'darkPurple',
            }}
            backgroundColor={
              current_period === 'posting' ? 'lightLilac' : 'darkPurple'
            }
            borderColor={current_period === 'posting' ? 'purple' : 'lightLilac'}
            variant={'outline'}
            borderWidth={'1px'}
            borderRadius={'90px'}
          >
            <Flex alignItems={'center'}>
              <Image
                src={
                  current_period === 'posting'
                    ? '/Posting_Period.svg'
                    : '/Voting_Period.svg'
                }
                alt="Perod Icon"
                width={'22px'}
                height={'22px'}
              />
              <Flex alignItems={'center'} width={'95%'} paddingLeft={'8px'}>
                <Text
                  fontWeight="bold"
                  fontSize="14px"
                  fontFamily="DM Sans"
                  color={current_period === 'posting' ? 'darkPurple' : 'green'}
                  paddingRight="10px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  Current cycle:{' '}
                  {data
                    ? (((current_period?.charAt(0).toUpperCase() as string) +
                        current_period?.slice(1)) as string)
                    : ''}
                </Text>
                <Divider
                  orientation="vertical"
                  height={22}
                  p={0}
                  borderColor={
                    current_period === 'posting' ? 'darkPurple' : 'lilac'
                  }
                />
                <Text
                  fontWeight="normal"
                  fontSize="14px"
                  fontFamily="DM Sans"
                  color={current_period === 'posting' ? 'midnight' : 'lilac'}
                  paddingLeft="10px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {data ? `${nextPeriodTimeLeft}` : ''}
                </Text>
              </Flex>
            </Flex>
          </MenuButton>
          <MenuList
            backgroundColor={
              current_period === 'posting' ? 'lightLilac' : 'darkPurple'
            }
            borderColor={current_period === 'posting' ? 'purple' : 'lightLilac'}
            borderWidth={1}
            width={'373px'}
            px={'18px'}
            borderRadius={'12px'}
          >
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Block
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {current_block}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Period
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {current_period
                  ? current_period.charAt(0).toUpperCase() +
                    current_period.slice(1)
                  : ''}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Posting Start
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime((current_posting_start as number) * 1e3)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Time in Cycle
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {current_time_in_cycle}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Voting Start
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime((current_voting_start as number) * 1e3)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Current Voting End
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime((current_voting_end as number) * 1e3)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Cycle Length
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {cycle_length}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Next Posting Start
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime((next_posting_start as number) * 1e3)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Next Voting Start
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {timestampToDateTime((next_voting_start as number) * 1e3)}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Posting Period Length
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {posting_period_length}
              </Text>
            </Flex>
            <Divider
              borderColor={
                current_period === 'posting'
                  ? 'rgba(81,54,194,0.1)'
                  : 'rgba(198,180,252,0.2)'
              }
            />
            <Flex width={'100%'} py={'5.3px'}>
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                Voting Period Length
              </Text>
              <Spacer />
              <Text
                color={current_period === 'posting' ? 'darkPurple' : 'white'}
                fontWeight="normal"
                fontFamily="DM Sans"
                fontSize={12}
              >
                {voting_period_length}
              </Text>
            </Flex>
          </MenuList>
        </>
      )}
    </Menu>
  );
}
