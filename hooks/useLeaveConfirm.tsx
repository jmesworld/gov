import {
  useState,
  useCallback,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from 'react';
import { useRouter } from 'next/router';
import { PromiseModal } from '../features/components/genial/PromiseModal';

type LeaveConfirmContextType = {
  check: boolean;
  preventNavigatingAway: boolean;
  setCheck: (check: boolean) => void;
  setPreventNavigatingAway: (navigateAway: boolean) => void;
};
const emptyFN = () => {
  throw new Error(
    'Forget wrapping your component with the LeaveConfirmContext ',
  );
};

const initialState: LeaveConfirmContextType = {
  check: true,
  preventNavigatingAway: false,
  setCheck: emptyFN,
  setPreventNavigatingAway: emptyFN,
};

const LeaveConfirmContext =
  createContext<LeaveConfirmContextType>(initialState);

export const LeaveConfirmContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [check, setCheck] = useState(true);
  const [preventNavigatingAway, setPreventNavigatingAway] = useState(false);

  const value: LeaveConfirmContextType = {
    check,
    preventNavigatingAway,
    setCheck,
    setPreventNavigatingAway,
  };

  return (
    <LeaveConfirmContext.Provider value={value}>
      {children}
    </LeaveConfirmContext.Provider>
  );
};

export const useLeaveConfirmContext = () => useContext(LeaveConfirmContext);

type Props = {
  preventNavigatingAway: boolean;
  title?: string;
  message?: string;
};

const defaultTitle = 'Are you sure you want to leave?';
const defaultMessage = 'All data will be lost.';

export function useLeaveConfirm({
  preventNavigatingAway: isDirty,
  title = defaultTitle,
  message = defaultMessage,
}: Props): [(check: boolean) => void, (route: string) => void] {
  const { check, setCheck, preventNavigatingAway, setPreventNavigatingAway } =
    useLeaveConfirmContext();

  const Router = useRouter();

  useEffect(() => {
    setCheck(true);
  }, [setCheck]);

  useEffect(() => {
    if (isDirty !== preventNavigatingAway) {
      setPreventNavigatingAway(isDirty);
    }
  }, [isDirty, preventNavigatingAway, setPreventNavigatingAway]);

  const onBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (check && preventNavigatingAway) {
        e.preventDefault();
        return (e.returnValue = message);
      }
    },
    [check, message, preventNavigatingAway],
  );

  const onRouteChangeStart = useCallback(
    (url: string) => {
      if (check && preventNavigatingAway) {
        PromiseModal({
          title,
          description: message,
        })
          .then(() => {
            setCheck(false);
            Router.push(url);
            return true;
          })
          .catch(() => {
            return false;
          });
        throw "Abort route change by user's confirmation.";
      }
      return true;
    },
    [Router, check, message, preventNavigatingAway, setCheck, title],
  );

  useEffect(() => {
    if (check) {
      Router.events.on('routeChangeStart', onRouteChangeStart);
      window.addEventListener('beforeunload', onBeforeUnload);
    } else {
      Router.events.off('routeChangeStart', onRouteChangeStart);
      window.removeEventListener('beforeunload', onBeforeUnload);
    }
    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [Router.events, check, onBeforeUnload, onRouteChangeStart]);

  const setRouterCheck = useCallback(
    (check: boolean) => {
      setCheck(check);
    },
    [setCheck],
  );

  const navigate = useCallback(
    (route: string) => {
      Router.push(route);
    },
    [Router],
  );

  return [setRouterCheck, navigate];
}
