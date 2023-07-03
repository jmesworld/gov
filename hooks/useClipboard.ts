import { useState } from 'react';

export function useClipboardTimeout(): [
  boolean,
  (value: string, timeout?: number) => void,
] {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (value: string, timeout = 2000) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, timeout);
      })
      .catch(error => {
        console.error('Failed to copy to clipboard:', error);
        setCopied(false);
      });
  };

  return [copied, copyToClipboard];
}
