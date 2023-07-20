import { Box, Flex, Progress, Text, Tooltip } from '@chakra-ui/react';
import {
  formatBalance,
  formatBalanceWithComma,
} from '../../../hooks/useAccountBalance';

interface ProposalProgressType {
  yesPercent: number;
  yesCount: number;
  noCount: number;
  noPercent: number;
  target: number;
  targetPercentage: number;
  width?: number;
}

export const ProposalProgress = ({
  yesCount,
  yesPercent,
  noCount,
  noPercent,
  target,
  targetPercentage,
  width,
}: ProposalProgressType) => {
  return (
    <Box
      height={'60px'}
      borderRadius={'30px'}
      width={width ? `${width}px` : '100%'}
      backgroundColor={'rgba(81, 54, 194, 1)'}
      padding={'10px 20px'}
      position={'relative'}
    >
      <Flex
        width={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Tooltip
          hasArrow
          label={formatBalanceWithComma(yesCount)}
          isDisabled={yesCount < 1000 && yesCount % 1 === 0}
        >
          <Text
            color="white"
            fontWeight="normal"
            fontSize={14}
            fontFamily="DM Sans"
            textTransform="uppercase"
            opacity={yesPercent > noPercent ? '1' : '0.5'}
            width={'69px'}
            textOverflow="ellipsis"
            textAlign={'left'}
            whiteSpace="pre"
            overflow="hidden"
          >
            <Box as="span" display="inline-block" width="30px">
              Yes
            </Box>
            <span>{formatBalance(yesCount, 0)}</span>
          </Text>
        </Tooltip>
        <Progress
          value={yesPercent}
          backgroundColor={'#5136C2'}
          width={'calc(100% - 56px)'}
          height={'10px'}
          borderRadius={'10px'}
          variant={'green'}
        />
      </Flex>
      <Flex
        width={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Tooltip
          hasArrow
          label={formatBalanceWithComma(noCount)}
          isDisabled={noCount < 1000 && noCount % 1 === 0}
        >
          <Text
            color="white"
            fontWeight="normal"
            fontSize={14}
            fontFamily="DM Sans"
            textTransform="uppercase"
            textOverflow="ellipsis"
            opacity={yesPercent > noPercent ? '0.5' : '1'}
            width={'69px'}
            textAlign={'left'}
            whiteSpace="pre"
            overflow="hidden"
          >
            <Box as="span" display="inline-block" width="30px">
              No
            </Box>
            <span>{formatBalance(noCount, 0)}</span>
          </Text>
        </Tooltip>
        <Progress
          value={noPercent}
          backgroundColor={'#5136C2'}
          width={'calc(100% - 65px)'}
          height={'10px'}
          borderRadius={'10px'}
          variant={'red'}
        />
      </Flex>
      <Box
        position={'absolute'}
        top={'0'}
        bottom={'0'}
        left={'76px'}
        right={'20px'}
      >
        <Box
          position={'absolute'}
          left={`calc( ${
            targetPercentage > 100 ? 100 : targetPercentage
          }% - 13px)`}
          top={0}
          bottom={0}
          width={'26px'}
        >
          <Box
            position={'absolute'}
            top={'-10px'}
            left="calc(50% - 20px)"
            height={'20px'}
            width="40px"
            backgroundColor={targetPercentage <= 100 ? 'white' : 'red'}
            zIndex={2}
            borderRadius={'10px'}
          >
            <Tooltip
              hasArrow
              label={formatBalanceWithComma(target)}
              isDisabled={target < 100 && target % 1 === 0}
            >
              <Text
                color={
                  targetPercentage <= 100 ? 'rgba(81, 54, 194, 1)' : 'white'
                }
                fontWeight="500"
                fontSize={'14px'}
                overflow="hidden"
                whiteSpace="pre"
                fontFamily="DM Sans"
                letterSpacing={'-0.05em'}
                textAlign={'center'}
                textOverflow={'ellipsis'}
              >
                {formatBalance(target, 0)}
              </Text>
            </Tooltip>
          </Box>
          <Flex
            position="absolute"
            top={0}
            bottom={0}
            left={'10px'}
            width={'6px'}
          >
            <Box
              width={'2px'}
              height={'100%'}
              backgroundColor={'rgba(116, 83, 253, .5)'}
            />
            <Box
              width={'2px'}
              height={'100%'}
              backgroundColor={targetPercentage <= 100 ? 'white' : 'red'}
            />
            <Box
              width={'2px'}
              height={'100%'}
              backgroundColor={'rgba(116, 83, 253, .5)'}
            />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
