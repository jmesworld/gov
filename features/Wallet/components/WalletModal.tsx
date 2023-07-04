import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../../config/defaults';
import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AddTokensCard from '../../Onboarding/components/AddTokensCard';
import ChooseUsernameCard from '../../Onboarding/ChooseUsernameModal';
import { useAccountBalance } from '../../../hooks/useAccountBalance';
import { useClientIdentity } from '../../../hooks/useClientIdentity';

export const WalletModal = () => {
  const { address, closeView, disconnect } = useChain(chainName);
  const { identityName, identityOwnerQuery } = useClientIdentity();
  const balance = useAccountBalance(address as string);

  const renderCard = () => {
    if (
      balance.data?.unstaked === 0 &&
      identityOwnerQuery?.status !== 'loading'
    ) {
      return (
        <CSSTransition
          classNames="card-animation"
          timeout={300}
          key="add-tokens-card"
        >
          <AddTokensCard />
        </CSSTransition>
      );
    } else if (!identityName && identityOwnerQuery?.status !== 'loading') {
      return (
        <CSSTransition
          classNames="card-animation"
          timeout={300}
          key="choose-username-card"
        >
          <ChooseUsernameCard identityName={identityName as string} />
        </CSSTransition>
      );
    } else {
      closeView();
      return null;
    }
  };

  return <TransitionGroup>{renderCard()}</TransitionGroup>;
};
