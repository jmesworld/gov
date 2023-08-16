// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <style>
          {`
          body: {
            display: block !important;
          }
          .shrink {
            transition: transform 1s ease-in-out;
            animation: shrinks 2s infinite;
          }
          
          @keyframes shrinks {
            0% {
              transform: scale(1.1);
            }
            50% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.1);
            }
             
          }

          #globalLoader {
            position: fixed;
            z-index: 9999;
            top: 50%;
            left: 50%;
            background-color: #fff;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
          
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #7453FD;
          }`}
        </style>
        <Head />
        <body
          style={{
            display: 'unset',
          }}
        >
          <div id="globalLoader">
            <img
              className="shrink"
              src="/LogoAnimate.svg"
              alt="loader"
              width="200px"
            />
          </div>
          <ColorModeScript type="localStorage" initialColorMode={'light'} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
