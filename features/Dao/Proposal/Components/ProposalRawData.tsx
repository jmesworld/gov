import { Flex, Text } from '@chakra-ui/react';
import { getProposalExcuteMsg } from '../../../../utils/proposalUti';
import dynamic from 'next/dynamic';
import { ProposalResponseForEmpty } from '../../../../client/DaoMultisig.types';
const CodeEditor = dynamic(import('../../../components/genial/CodeEditor'), {
  ssr: false,
});
type Props = {
  proposal: ProposalResponseForEmpty;
};

export const ProposalExcuteRawData = ({ proposal }: Props) => {
  const excuteMessage = getProposalExcuteMsg(proposal);

  return (
    <Flex
      flexDir="row"
      mt="4"
      background="rgba(112, 79, 247, 0.1)"
      borderRadius="12px"
      border="1px solid rgba(112, 79, 247, 0.5)"
      padding="14px 16px"
      marginTop="20px"
    >
      <Text color="purple">Raw Proposal Data</Text>
      <Flex flexGrow={1} w="full">
        <CodeEditor
          width="100%"
          showPrintMargin
          showGutter={false}
          readonly
          style={{
            backgroundColor: 'transparent',
            height: '300px',
          }}
          setOptions={{
            highlightSelectedWord: false,
            highlightActiveLine: false,
            showPrintMargin: false,
            showGutter: false,
            showLineNumbers: true,
          }}
          editorProps={{
            $blockScrolling: true,
          }}
          value={JSON.stringify(excuteMessage, null, 2)}
        />
      </Flex>
    </Flex>
  );
};
