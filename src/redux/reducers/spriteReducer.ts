// src/redux/reducers/spriteReducer.ts

export interface Sprite {
  id: string;
  x: number;
  y: number;
  rotation: number; // Represents the sprite's facing direction (in degrees)
  // New property: optional speech bubble for say/think actions
  speechBubble?: { text: string; type: "say" | "think" } | null;
}

export interface SpritesState {
  byId: Record<string, Sprite>;
  allIds: string[];
}

const initialState: SpritesState = {
  byId: {
    sprite1: { id: "sprite1", x: 0, y: 0, rotation: 0, speechBubble: null },
  },
  allIds: ["sprite1"],
};

// Action types
const ADD_SPRITE = "ADD_SPRITE";
const UPDATE_SPRITE = "UPDATE_SPRITE";
const TURN_SPRITE = "TURN_SPRITE";
const SET_SPEECH_BUBBLE = "SET_SPEECH_BUBBLE";

// Action Interfaces
interface AddSpriteAction {
  type: typeof ADD_SPRITE;
  payload: Sprite;
}

interface UpdateSpriteAction {
  type: typeof UPDATE_SPRITE;
  payload: Sprite;
}

interface TurnSpriteAction {
  type: typeof TURN_SPRITE;
  payload: {
    id: string;
    delta: number; // Amount (in degrees) to add (or subtract) from the current rotation
  };
}

interface SetSpeechBubbleAction {
  type: typeof SET_SPEECH_BUBBLE;
  payload: { id: string; bubble: Sprite["speechBubble"] };
}

type SpritesActionTypes =
  | AddSpriteAction
  | UpdateSpriteAction
  | TurnSpriteAction
  | SetSpeechBubbleAction;

// The reducer
const spritesReducer = (
  state = initialState,
  action: SpritesActionTypes
): SpritesState => {
  switch (action.type) {
    case ADD_SPRITE:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id],
      };
    case UPDATE_SPRITE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            ...action.payload,
          },
        },
      };
    case TURN_SPRITE: {
      const { id, delta } = action.payload;
      const sprite = state.byId[id];
      if (!sprite) return state;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...sprite,
            rotation: sprite.rotation + delta,
          },
        },
      };
    }
    case SET_SPEECH_BUBBLE: {
      const { id, bubble } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            speechBubble: bubble,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default spritesReducer;

// Action Creators
export const addSprite = (sprite: Sprite): AddSpriteAction => ({
  type: ADD_SPRITE,
  payload: sprite,
});

export const updateSprite = (sprite: Sprite): UpdateSpriteAction => ({
  type: UPDATE_SPRITE,
  payload: sprite,
});

export const turnSprite = (id: string, delta: number): TurnSpriteAction => ({
  type: TURN_SPRITE,
  payload: { id, delta },
});

export const setSpeechBubble = (
  id: string,
  bubble: Sprite["speechBubble"]
): SetSpeechBubbleAction => ({
  type: SET_SPEECH_BUBBLE,
  payload: { id, bubble },
});
