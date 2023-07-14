import type { Member as MemberBasic } from './createDAOReducer';
export type Member = MemberBasic & {
  og?: boolean;
  isRemoved?: boolean;
};
type Spend = {
  id: string;
  name: string;
  address?: string | null;
  error?: string;
  amount: number;
};

// TODO: remove this
export type Balance = {
  jmes: string;
};

export type Input = {
  value: string;
  error?: string;
};

export type State = {
  ownerId: string;
  title: Input;
  description: Input;
  members: Record<string, Member>;
  spends: Record<string, Spend>;
  balance: Balance;
  threshold: Input;
};

export type Actions =
  | {
      type: 'ADD_MEMBER';
      payload: Member;
    }
  | {
      type: 'ADD_MEMBERS';
      payload: Member[];
    }
  | {
      type: 'SET_MEMBER_VALUE';
      payload: Partial<Member>;
    }
  | {
      type: 'REMOVE_MEMBER';
      payload: string;
    }
  | {
      type: 'SET_INPUT_VALUE';
      payload: {
        type: 'title' | 'description' | 'threshold';
        value: string;
        error?: string;
      };
    }
  | {
      type: 'Add_SPEND';
      payload: Spend;
    }
  | {
      type: 'SET_SPEND_VALUE';
      payload: Partial<Spend>;
    }
  | {
      type: 'REMOVE_SPEND';
      payload: string;
    }
  | {
      type: 'RESET';
      payload: State;
    };

export function DAOProposalReducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'ADD_MEMBERS': {
      const memberArr = Object.values(state.members);
      const membersRecord = action.payload.reduce((acc, curr) => {
        const index = memberArr.findIndex(el => el.address === curr.address);
        if (index !== -1) {
          return acc;
        }

        acc[curr.id] = curr;
        return acc;
      }, {} as Record<string, Member>);
      return {
        ...state,
        members: {
          ...state.members,
          ...membersRecord,
        },
      };
    }
    case 'ADD_MEMBER':
      return {
        ...state,
        members: {
          ...state.members,
          [action.payload.id]: action.payload,
        },
      };

    case 'REMOVE_MEMBER': {
      const members = { ...state.members };
      const member = members[action.payload];
      return {
        ...state,
        members: {
          ...members,
          [action.payload]: {
            ...member,
            isRemoved: true,
          },
        },
      };
    }
    case 'SET_MEMBER_VALUE': {
      const member = state.members[action.payload.id ?? ''];
      if (!member) {
        return state;
      }
      const sameAddressMembers = Object.values(state.members).find(
        el =>
          action.payload?.address &&
          el.address === action.payload.address &&
          !el.isRemoved &&
          el.id !== action.payload.id,
      );
      return {
        ...state,
        members: {
          ...state.members,
          [member.id]: {
            ...member,
            ...action.payload,
            ...(sameAddressMembers
              ? {
                  error: 'Address already exists',
                }
              : {
                  error: undefined,
                }),
          },
        },
      };
    }
    case 'SET_INPUT_VALUE': {
      const type = action.payload.type;
      return {
        ...state,
        ...(type === 'title' && {
          title: {
            ...action.payload,
          },
        }),
        ...(type === 'description' && {
          description: {
            ...action.payload,
          },
        }),
        ...(type === 'threshold' && {
          threshold: {
            ...action.payload,
          },
        }),
      };
    }
    case 'Add_SPEND':
      return {
        ...state,
        spends: {
          ...state.spends,
          [action.payload.id]: action.payload,
        },
      };
    case 'SET_SPEND_VALUE': {
      const spend = state.spends[action.payload.id ?? ''];
      if (!spend) {
        return state;
      }
      return {
        ...state,
        spends: {
          ...state.spends,
          [spend.id]: {
            ...spend,
            ...action.payload,
          },
        },
      };
    }
    case 'REMOVE_SPEND': {
      const spends = { ...state.spends };
      delete spends[action.payload];
      return {
        ...state,
        spends: {
          ...spends,
        },
      };
    }
    case 'RESET':
      return action.payload;
    default:
      throw new Error('Action not found');
  }
}
