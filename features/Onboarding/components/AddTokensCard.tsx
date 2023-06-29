import { CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Spacer,
  Image,
  Text,
  IconButton,
  useToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
} from '@chakra-ui/react';
import OnboardingProgressIndicator from './OnboardingProgressIndicator';
import { useAccountBalance } from '../../../hooks/useAccountBalance';
import { useCosmWasmClient } from '../../../contexts/ClientContext';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../../config/defaults';

const AddTokensCard = () => {
  const toast = useToast();
  const { address } = useChain(chainName);
  const { identityName, walletAddress, disconnect } = useCosmWasmClient();
  const identityBalanceQuery = useAccountBalance(address as string);
  const balance: any = identityBalanceQuery.data ?? 0;

  return (
    <>
      <Modal
        isOpen={true}
        onClose={() => {}}
        isCentered={true}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalContent
          maxW="500px"
          maxH="675px"
          alignItems={'center'}
          borderRadius={'12px'}
        >
          <ModalBody
            backgroundColor={'#704FF7'}
            width={'500px'}
            height={'500px'}
            borderRadius={'12px'}
          >
            <Box
              width={'500px'}
              height={'590px'}
              alignItems={'center'}
              marginTop={'-41px'}
            >
              <Flex>
                <Flex width={'100%'} justifyContent={'space-between'}>
                  <Spacer />
                  <Image
                    src="/Barcode.svg"
                    alt="icon"
                    width={'232px'}
                    height={'234px'}
                    justifySelf={'center'}
                    marginRight={'40px'}
                  />
                  <Spacer />
                </Flex>
                <Spacer />
              </Flex>
              <Flex>
                <Spacer />
                <Text
                  color={'white'}
                  fontWeight={'bold'}
                  fontSize={28}
                  fontFamily="DM Sans"
                  paddingBottom={'4px'}
                  marginTop={'34px'}
                >
                  Add tokens to wallet
                </Text>
                <Spacer />
              </Flex>
              <Flex>
                <Spacer />
                <Box width={'151px'} paddingRight={'11px'}>
                  <Text
                    color={'white'}
                    fontWeight={'normal'}
                    fontSize={12}
                    fontFamily="DM Sans"
                  >
                    Balance
                  </Text>
                  <Flex
                    width={'100%'}
                    height={'49px'}
                    borderColor={'darkPurple'}
                    borderWidth={'1px'}
                    borderRadius={'12px'}
                    marginTop={'8px'}
                    px={'16px'}
                    alignItems={'center'}
                  >
                    <Image
                      src="/JMES_Icon_white.svg"
                      alt="JMES Icon"
                      width={'16.4px'}
                      height={'20px'}
                      fill={'white'}
                    />
                    <Text
                      color={'white'}
                      fontWeight={'normal'}
                      fontSize={18}
                      marginLeft={'10.6px'}
                      noOfLines={1}
                      fontFamily="DM Sans"
                    >
                      {`${
                        identityBalanceQuery.isSuccess
                          ? balance.unstaked
                          : 'loading...'
                      }`}
                    </Text>
                  </Flex>
                </Box>
                <Box width={'279px'} marginRight={'40px'}>
                  <Text
                    color={'white'}
                    fontWeight={'normal'}
                    fontSize={12}
                    fontFamily="DM Sans"
                  >
                    Address
                  </Text>
                  <Flex
                    width={'100%'}
                    height={'49px'}
                    borderColor={'darkPurple'}
                    backgroundColor={'darkPurple'}
                    borderRadius={'12px'}
                    marginTop={'8px'}
                    px={'13px'}
                    alignItems={'center'}
                  >
                    <Text
                      color={'white'}
                      fontWeight={'normal'}
                      fontSize={18}
                      marginLeft={'14px'}
                      noOfLines={1}
                      fontFamily="DM Sans"
                    >
                      {`${address?.slice(0, 13)}...${address?.slice(
                        address.length - 4,
                        address.length,
                      )}`}
                    </Text>
                    <IconButton
                      width={'24px'}
                      height={'24px'}
                      marginLeft={'14px'}
                      aria-label={''}
                      backgroundColor={'transparent'}
                      _hover={{ bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                      onClick={() => {
                        navigator.clipboard.writeText(address as string);
                        toast({
                          title: 'Copied to clipboard',
                          description: '',
                          status: 'success',
                          duration: 1000,
                        });
                      }}
                    >
                      <CopyIcon
                        width={'24px'}
                        height={'24px'}
                        color={'white'}
                        type={'button'}
                      />
                    </IconButton>
                  </Flex>
                </Box>
                <Spacer />
              </Flex>
              <Flex
                marginBottom={'25px'}
                marginTop={'38px'}
                marginRight={'40px'}
              >
                <Spacer />
                <Button
                  disabled={false}
                  onClick={() => {
                    disconnect();
                    window.location.reload();
                    window.localStorage.clear();
                  }}
                  backgroundColor={'green'}
                  borderRadius={90}
                  alignContent="end"
                  width={'200px'}
                  height={'48px'}
                  _hover={{ bg: 'green' }}
                  _active={{ bg: 'green' }}
                  variant={'outline'}
                  borderWidth={'1px'}
                  borderColor={'rgba(0,0,0,0.1)'}
                >
                  <Text
                    color="midnight"
                    fontFamily={'DM Sans'}
                    fontWeight="medium"
                    fontSize={14}
                  >
                    Disconnect
                  </Text>
                </Button>
                <Spacer />
              </Flex>
              <Spacer />
              <Box marginRight={'40px'}>
                <OnboardingProgressIndicator activeCard="add-tokens-card" />
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTokensCard;
