import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers";
import { addSprite, deleteSprite } from "../redux/reducers/spriteReducer";
import {
  addActionToSprite,
  setSelectedSprite,
} from "../redux/reducers/editorReducer"; // 👈 import
import CatSprite from "./CatSprite";
import { useEffect } from "react";

// Helper to create a new sprite.
const createNewSprite = (): any => ({
  id: `sprite-${Date.now()}`,
  x: 0,
  y: 0,
  rotation: 0,
  speechBubble: null,
});

function SpritePanel() {
  const dispatch = useDispatch();
  const sprites = useSelector((state: RootState) => state.sprites.byId);
  const allIds = useSelector((state: RootState) => state.sprites.allIds);
  const actionSets = useSelector((state: RootState) => state.editor.actionSets);
  const stateSelectedId = useSelector(
    (state: RootState) => state.editor.selectedSpriteId
  );
  const selectedId = stateSelectedId || allIds[0];

  useEffect(() => {
    if (allIds.length > 0 && !stateSelectedId) {
      dispatch(setSelectedSprite(allIds[0]));
    }
  }, [allIds, dispatch]);

  const handleAddSprite = () => {
    const newSprite = createNewSprite();
    dispatch(addSprite(newSprite));
    dispatch(setSelectedSprite(newSprite.id));

    // Copy action set from the first sprite (if exists)
    if (allIds.length > 0) {
      const firstId = allIds[0];
      const clonedActions =
        actionSets[firstId]?.map((action) => ({ ...action })) || [];

      for (const action of clonedActions) {
        dispatch(addActionToSprite(newSprite.id, action));
      }
    }
  };

  const handleDeleteSprite = (id: string) => {
    dispatch(deleteSprite(id));
    if (selectedId === id) {
      dispatch(setSelectedSprite(null));
    }
  };

  const handleSelect = (id: string) => {
    dispatch(setSelectedSprite(id));
  };

  return (
    <div className="h-full p-4 bg-white border-t border-gray-300 flex flex-col">
      <h3 className="text-lg font-bold mb-2">Sprites</h3>
      <div className="flex flex-wrap gap-2">
        {allIds.map((id) => {
          const sprite = sprites[id];
          return (
            <div
              key={id}
              onClick={() => handleSelect(id)}
              className={`p-2 border rounded cursor-pointer flex flex-col items-center ${
                selectedId === id ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <div className="scale-75">
                <CatSprite />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSprite(id);
                }}
                className="mt-1 text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex">
        <button
          onClick={handleAddSprite}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Sprite
        </button>
      </div>
    </div>
  );
}

export default SpritePanel;
