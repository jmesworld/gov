import { State } from '../../DaoProposalReducer';
import * as DaoMembers from '../../../../client/DaoMembers.types';
import * as DaoMultisig from '../../../../client/DaoMultisig.types';
import { ProposalTypes } from '../../DAOProposal';

export const getRequest = (state: State, activeProposalType: ProposalTypes) => {
  const { members, title, description } = state;
  switch (activeProposalType) {
    case 'update-directories': {
      let response: DaoMembers.ExecuteMsg | null = null;
      // update list
      const updateList = Object.values(members)
        .filter(el => !el.isRemoved)
        .map(el => ({
          addr: el.address as string,
          weight: el.votingPower as number,
        }));

      // remove list
      const memberRemoveList = Object.values(members)
        .filter(el => {
          const sameAddress = Object.values(members).filter(
            el2 =>
              el2.address === el.address && !el2.isRemoved && el2.id !== el.id,
          );

          if (sameAddress.length >= 1) {
            return false;
          }
          return el.og && el.isRemoved;
        })
        .map(el => el.address as string);
      response = {
        update_members: {
          remove: memberRemoveList,
          add: updateList,
        },
      };
      return response;
    }
    case 'spend-dao-funds': {
      const spendArr = Object.values(state.spends);
      const msgs: DaoMultisig.CosmosMsgForEmpty[] = [];
      spendArr.forEach(spend => {
        msgs.push({
          bank: {
            send: {
              amount: [
                {
                  denom: 'ujmes',
                  amount: String(spend.amount),
                } as DaoMultisig.Coin,
              ],

              to_address: spend.address as string,
            },
          },
        });
      });

      if (msgs.length > 0) {
        const msg: DaoMultisig.ExecuteMsg = {
          propose: {
            latest: undefined,
            title: title.value,
            description: description.value,
            msgs,
          },
        };
        return msg;
      }
    }
  }
};
