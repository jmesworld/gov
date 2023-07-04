import * as React from 'react';
import { useRouter } from 'next/router';

type Props = {
  preventNavigatingAway: boolean;
  message?: string;
};

const defaultMessage = 'Are you sure to leave without save?';

export function useLeaveConfirm({
  preventNavigatingAway,
  message = defaultMessage,
}: Props) {
  const Router = useRouter();

  const onRouteChangeStart = React.useCallback(() => {
    if (preventNavigatingAway) {
      if (window.confirm(message)) {
        return true;
      }
      throw "Abort route change by user's confirmation.";
    }
  }, [message, preventNavigatingAway]);

  React.useEffect(() => {
    Router.events.on('routeChangeStart', onRouteChangeStart);

    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart);
    };
  }, [Router.events, onRouteChangeStart]);

  return;
}
