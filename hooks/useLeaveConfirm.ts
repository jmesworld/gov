import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

type Props = {
  preventNavigatingAway: boolean;
  message?: string;
};

const defaultMessage = 'Are you sure to leave without save?';

export function useLeaveConfirm({
  preventNavigatingAway,
  message = defaultMessage,
}: Props): [(check: false) => void, (route: string) => void] {
  const [check, setCheck] = useState(true);
  const Router = useRouter();

  const onRouteChangeStart = useCallback(() => {
    if (check && preventNavigatingAway) {
      if (window.confirm(message)) {
        return true;
      }
      throw "Abort route change by user's confirmation.";
    }
    return true;
  }, [check, message, preventNavigatingAway]);

  useEffect(() => {
    if (check) Router.events.on('routeChangeStart', onRouteChangeStart);
    else Router.events.off('routeChangeStart', onRouteChangeStart);
    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart);
    };
  }, [Router.events, check, onRouteChangeStart]);

  const setRouterCheck = useCallback((check: boolean) => {
    setCheck(check);
  }, []);

  const navigate = useCallback(
    (route: string) => {
      Router.push(route);
    },
    [Router],
  );

  return [setRouterCheck, navigate];
}
