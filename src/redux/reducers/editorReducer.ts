import { AnimationBlock } from "../../animationBlocks";

const SET_SELECTED_SPRITE = "SET_SELECTED_SPRITE";
const ADD_ACTION_TO_SPRITE = "ADD_ACTION_TO_SPRITE";
const UPDATE_ACTION_PARAM = "UPDATE_ACTION_PARAM";
const REMOVE_ACTION_FROM_SPRITE = "REMOVE_ACTION_FROM_SPRITE";
const RESET_ACTION_SET_FOR_SPRITE = "RESET_ACTION_SET_FOR_SPRITE";
const SET_ACTION_SET = "SET_ACTION_SET";

interface EditorState {
  selectedSpriteId: string | null;
  actionSets: {
    [spriteId: string]: AnimationBlock[];
  };
}

const initialState: EditorState = {
  selectedSpriteId: null,
  actionSets: {},
};

interface SetSelectedSpriteAction {
  type: typeof SET_SELECTED_SPRITE;
  payload: string | null;
}

interface AddActionToSpriteAction {
  type: typeof ADD_ACTION_TO_SPRITE;
  payload: { spriteId: string; block: AnimationBlock };
}

interface UpdateActionParamAction {
  type: typeof UPDATE_ACTION_PARAM;
  payload: {
    spriteId: string;
    blockIndex: number;
    paramKey: string;
    value: any;
  };
}

interface RemoveActionFromSpriteAction {
  type: typeof REMOVE_ACTION_FROM_SPRITE;
  payload: { spriteId: string; blockIndex: number };
}

interface ResetActionSetForSpriteAction {
  type: typeof RESET_ACTION_SET_FOR_SPRITE;
  payload: { spriteId: string };
}

interface SetActionSetAction {
  type: typeof SET_ACTION_SET;
  payload: { spriteId: string; actions: AnimationBlock[] };
}

type EditorActionTypes =
  | SetSelectedSpriteAction
  | AddActionToSpriteAction
  | UpdateActionParamAction
  | RemoveActionFromSpriteAction
  | ResetActionSetForSpriteAction
  | SetActionSetAction;

const editorReducer = (
  state = initialState,
  action: EditorActionTypes
): EditorState => {
  switch (action.type) {
    case SET_SELECTED_SPRITE:
      return {
        ...state,
        selectedSpriteId: action.payload,
      };

    case ADD_ACTION_TO_SPRITE: {
      const { spriteId, block } = action.payload;
      const current = state.actionSets[spriteId] || [];
      return {
        ...state,
        actionSets: {
          ...state.actionSets,
          [spriteId]: [...current, block],
        },
      };
    }

    case UPDATE_ACTION_PARAM: {
      const { spriteId, blockIndex, paramKey, value } = action.payload;
      const spriteActions = [...(state.actionSets[spriteId] || [])];
      if (!spriteActions[blockIndex]) return state;
      spriteActions[blockIndex] = {
        ...spriteActions[blockIndex],
        params: {
          ...spriteActions[blockIndex].params,
          [paramKey]: value,
        },
      };
      return {
        ...state,
        actionSets: {
          ...state.actionSets,
          [spriteId]: spriteActions,
        },
      };
    }

    case REMOVE_ACTION_FROM_SPRITE: {
      const { spriteId, blockIndex } = action.payload;
      const updated = [...(state.actionSets[spriteId] || [])];
      updated.splice(blockIndex, 1);
      return {
        ...state,
        actionSets: {
          ...state.actionSets,
          [spriteId]: updated,
        },
      };
    }

    case RESET_ACTION_SET_FOR_SPRITE: {
      const { spriteId } = action.payload;
      return {
        ...state,
        actionSets: {
          ...state.actionSets,
          [spriteId]: [],
        },
      };
    }

    case SET_ACTION_SET: {
      const { spriteId, actions } = action.payload;
      return {
        ...state,
        actionSets: {
          ...state.actionSets,
          [spriteId]: actions,
        },
      };
    }

    default:
      return state;
  }
};

export default editorReducer;

export const setSelectedSprite = (
  id: string | null
): SetSelectedSpriteAction => ({
  type: SET_SELECTED_SPRITE,
  payload: id,
});

export const addActionToSprite = (
  spriteId: string,
  block: AnimationBlock
): AddActionToSpriteAction => ({
  type: ADD_ACTION_TO_SPRITE,
  payload: { spriteId, block },
});

export const updateActionParam = (
  spriteId: string,
  blockIndex: number,
  paramKey: string,
  value: any
): UpdateActionParamAction => ({
  type: UPDATE_ACTION_PARAM,
  payload: { spriteId, blockIndex, paramKey, value },
});

export const removeActionFromSprite = (
  spriteId: string,
  blockIndex: number
): RemoveActionFromSpriteAction => ({
  type: REMOVE_ACTION_FROM_SPRITE,
  payload: { spriteId, blockIndex },
});

export const resetActionSetForSprite = (
  spriteId: string
): ResetActionSetForSpriteAction => ({
  type: RESET_ACTION_SET_FOR_SPRITE,
  payload: { spriteId },
});

export const setActionSet = (
  spriteId: string,
  actions: AnimationBlock[]
): SetActionSetAction => ({
  type: SET_ACTION_SET,
  payload: { spriteId, actions },
});
