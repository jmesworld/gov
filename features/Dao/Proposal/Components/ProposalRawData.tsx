import React from 'react';
import { Box, Flex, Switch, Text } from '@chakra-ui/react';
import { getProposalExcuteMsg } from '../../../../utils/proposalUti';
import dynamic from 'next/dynamic';
import { ProposalResponseForEmpty } from '../../../../client/DaoMultisig.types';
import { ProposalResponse } from '../../../../client/Governance.types';
const CodeEditor = dynamic(import('../../../components/genial/CodeEditor'), {
  ssr: false,
});
type Props = {
  proposal: ProposalResponseForEmpty | ProposalResponse;
};

export const ProposalExcuteRawData = ({ proposal }: Props) => {
  const { excuteMsgs, msgs } = getProposalExcuteMsg(proposal);
  const [isJson, setIsJson] = React.useState(true);

  return (
    <Box mt="4">
      <Text color="purple">Raw Proposal Data</Text>
      <Flex
        flexDir="row"
        mt="10px"
        background="rgba(112, 79, 247, 0.1)"
        borderRadius="12px"
        border="1px solid rgba(112, 79, 247, 0.5)"
        padding="14px 16px"
        pos="relative"
      >
        {excuteMsgs.length > 0 && (
          <Flex
            pos="absolute"
            right={0}
            display="flex"
            alignItems="center"
            gap="3"
            mr="3"
            zIndex={99}
          >
            <Text color="purple"> {isJson ? 'JSON' : 'Base64'} </Text>
            <Switch
              color="purple"
              size="sm"
              onChange={() => setIsJson(!isJson)}
              isChecked={isJson}
            />
          </Flex>
        )}

        <Flex flexGrow={1} w="full">
          <CodeEditor
            width="100%"
            showPrintMargin
            showGutter={true}
            readonly
            style={{
              backgroundColor: 'transparent',
              height: '300px',
            }}
            setOptions={{
              highlightSelectedWord: false,
              highlightActiveLine: false,
              showPrintMargin: false,
              showGutter: true,
              showLineNumbers: false,
            }}
            editorProps={{
              $blockScrolling: true,
            }}
            value={
              isJson && excuteMsgs.length > 0
                ? JSON.stringify(excuteMsgs, null, 2)
                : JSON.stringify(msgs, null, 2)
            }
          />
        </Flex>
      </Flex>
    </Box>
  );
};
