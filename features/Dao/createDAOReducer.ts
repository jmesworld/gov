export type Member = {
  id: string;
  name: string;
  address?: string | null;
  error?: string;
  votingPower?: number;
};

export type State = {
  ownerId: string;
  members: Record<string, Member>;
  daoNameError?: string | null;
  daoName: string;
  threshold: number;
};

export type Actions =
  | {
      type: 'ADD_MEMBER';
      payload: Member;
    }
  | {
      type: 'SET_VALUE';
      payload: Partial<Member>;
    }
  | {
      type: 'REMOVE_MEMBER';
      payload: string;
    }
  | {
      type: 'SET_DAO_NAME';
      payload: {
        value: string;
        error?: string | null;
      };
    }
  | {
      type: 'SET_THRESHOLD';
      payload: number;
    }
  | {
      type: 'SET_OWNER_ID';
      payload: string;
    }
  | {
      type: 'RESET';
      payload: State;
    };

export function Reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'ADD_MEMBER':
      return {
        ...state,
        members: {
          ...state.members,
          [action.payload.id]: action.payload,
        },
      };
    case 'SET_VALUE': {
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
    case 'SET_DAO_NAME':
      return {
        ...state,
        daoName: action.payload.value,
        daoNameError: action.payload.error,
      };
    case 'SET_THRESHOLD':
      return {
        ...state,
        threshold: action.payload,
      };
    case 'SET_OWNER_ID':
      return {
        ...state,
        ownerId: action.payload,
      };
    case 'RESET':
      return { ...action.payload };
    default:
      throw new Error('Action not found');
  }
}
