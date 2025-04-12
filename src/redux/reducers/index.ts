import { combineReducers } from "redux";
import spritesReducer from "./spriteReducer";
import editorReducer from "./editorReducer";

const rootReducer = combineReducers({
  sprites: spritesReducer,
  editor: editorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof rootReducer;
export default rootReducer;
