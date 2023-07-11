import React from 'react';
import AceEditor, { IAceEditorProps } from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { Flex } from '@chakra-ui/react';

type props = {
  value: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
  height?: string;
} & IAceEditorProps;

const CodeEditor = ({
  value,
  onChange,
  readonly = false,
  height,
  ...rest
}: props) => {
  if (!window) {
    return null;
  }
  return (
    <Flex
      id="code-editor"
      h={height ? height : 'auto'}
      width={'100%'}
      overflow={'hidden'}
    >
      <AceEditor
        readOnly={readonly}
        value={value}
        mode="json"
        theme="github"
        onChange={onChange}
        name="code-editor"
        {...rest}
      />
    </Flex>
  );
};

export default CodeEditor;
