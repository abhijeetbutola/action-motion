import { combineReducers } from "redux";
import spritesReducer from "./spriteReducer";

const rootReducer = combineReducers({
  sprites: spritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
