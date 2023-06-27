import LinkElem, { LinkProps as LinkBaseProps } from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { ReactElement } from 'react';

type LinkWithActiveProps = {
  children?: ({ isActive }: { isActive: boolean }) => ReactElement;
  activePattern?: RegExp[];
  matchFunc?: (route: NextRouter) => boolean;
} & LinkBaseProps;
const LinkWithActive = ({
  href,
  children,
  activePattern,
  matchFunc,
  ...rest
}: LinkWithActiveProps) => {
  const router = useRouter();
  const isActive = activePattern
    ? activePattern.some(pattern => pattern.test(router.route))
    : router.route === href;
  const matchResult = matchFunc ? matchFunc(router) : isActive;
  return (
    <LinkElem {...rest} href={href}>
      {children && children({ isActive: matchResult })}
    </LinkElem>
  );
};

type LinkProps = {
  children?: ReactElement;
  activePattern?: RegExp;
} & LinkBaseProps;
const Link = ({
  href,
  children,

  ...rest
}: LinkProps) => {
  return (
    <LinkElem {...rest} href={href}>
      {children}
    </LinkElem>
  );
};

Link.withStatus = LinkWithActive;
export { Link };
