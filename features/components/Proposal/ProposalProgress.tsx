import { Box, Flex, Progress, Text } from '@chakra-ui/react';
import { formatBalance } from '../../../hooks/useAccountBalance';

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
        <Text
          color="white"
          fontWeight="normal"
          fontSize={14}
          fontFamily="DM Sans"
          textTransform="uppercase"
          opacity={yesPercent > noPercent ? '1' : '0.5'}
          width={'58px'}
          textAlign={'left'}
        >
          Yes {formatBalance(yesCount)}
        </Text>
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
        <Text
          color="white"
          fontWeight="normal"
          fontSize={14}
          fontFamily="DM Sans"
          textTransform="uppercase"
          opacity={yesPercent > noPercent ? '0.5' : '1'}
          width={'58px'}
          textAlign={'left'}
        >
          No {formatBalance(noCount)}
        </Text>
        <Progress
          value={noPercent}
          backgroundColor={'#5136C2'}
          width={'calc(100% - 56px)'}
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
          left={'calc(' + targetPercentage + '% - 13px)'}
          top={0}
          bottom={0}
          width={'26px'}
        >
          <Box
            position={'absolute'}
            top={'-10px'}
            left="calc(50% - 16px)"
            height={'20px'}
            width="32px"
            backgroundColor={'white'}
            zIndex={2}
            borderRadius={'10px'}
          >
            <Text
              color="rgba(81, 54, 194, 1)"
              fontWeight="500"
              fontSize={'14px'}
              fontFamily="DM Sans"
              letterSpacing={'-0.05em'}
              textAlign={'center'}
            >
              {formatBalance(target)}
            </Text>
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
            <Box width={'2px'} height={'100%'} backgroundColor={'white'} />
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
