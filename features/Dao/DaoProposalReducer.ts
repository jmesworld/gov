import { PartialExcept } from '../../utils/ts';
import type { Member } from './createDAOReducer';
type Spend = {
  id: string;
  name: string;
  address?: string;
  error?: string;
  amount: number;
};

type Balance = {
  jmes: string;
};

type Input = {
  value: string;
  error?: string;
};

type State = {
  ownerId: string;
  title: Input;
  description: Input;
  members: Record<string, Member>;
  spends: Record<string, Spend>;
  balance: Balance;
  threshold: Input;
};

type Actions =
  | {
      type: 'ADD_MEMBER';
      payload: Member;
    }
  | {
      type: 'SET_MEMBER_VALUE';
      payload: PartialExcept<Member, 'id'>;
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
      payload: PartialExcept<Spend, 'id'>;
    }
  | {
      type: 'REMOVE_SPEND';
      payload: string;
    };

export function DAOProposalReducer(state: State, action: Actions): State {
  switch (action.type) {
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
      delete members[action.payload];
      return {
        ...state,
        members: {
          ...members,
        },
      };
    }
    case 'SET_MEMBER_VALUE': {
      const member = state.members[action.payload.id ?? ''];
      if (!member) {
        return state;
      }
      return {
        ...state,
        members: {
          ...state.members,
          [member.id]: {
            ...member,
            ...action.payload,
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
    default:
      throw new Error('Action not found');
  }
}
