export interface Sprite {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

export interface SpritesState {
  byId: Record<string, Sprite>;
  allIds: string[];
}

const initialState: SpritesState = {
  byId: {
    sprite1: { id: "sprite1", x: 0, y: 0, rotation: 0 },
  },
  allIds: ["sprite1"],
};

// Action types
const ADD_SPRITE = "ADD_SPRITE";
const UPDATE_SPRITE = "UPDATE_SPRITE";

interface AddSpriteAction {
  type: typeof ADD_SPRITE;
  payload: Sprite;
}

interface UpdateSpriteAction {
  type: typeof UPDATE_SPRITE;
  payload: Sprite;
}

type SpritesActionTypes = AddSpriteAction | UpdateSpriteAction;

const spritesReducer = (
  state = initialState,
  action: SpritesActionTypes
): SpritesState => {
  switch (action.type) {
    case ADD_SPRITE:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id]: action.payload },
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
    default:
      return state;
  }
};

export default spritesReducer;

export const addSprite = (sprite: Sprite): AddSpriteAction => ({
  type: ADD_SPRITE,
  payload: sprite,
});

export const updateSprite = (sprite: Sprite): UpdateSpriteAction => ({
  type: UPDATE_SPRITE,
  payload: sprite,
});
