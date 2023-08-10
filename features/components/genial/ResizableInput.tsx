import React from 'react';
import { Textarea, TextareaProps } from '@chakra-ui/react';
import ResizeTextarea from 'react-textarea-autosize';

export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function resizable(props, ref) {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref}
      minRows={1}
      as={ResizeTextarea}
      {...props}
    />
  );
});
