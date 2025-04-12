import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers";
import { Sprite } from "../redux/reducers/spriteReducer";
import DraggableSprite from "./DraggableSprite";
import { AnimationBlock } from "../animationBlocks";
import { setActionSet } from "../redux/reducers/editorReducer";
import { executeAction } from "../utils/executeAction";
import { AppDispatch } from "../redux/store";
import { useRef } from "react";
import Button from "./Button";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isColliding(
  a: { x: number; y: number },
  b: { x: number; y: number },
  threshold = 40
) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < threshold;
}

function PreviewArea() {
  const stopAllRef = useRef(false);
  const sprites = useSelector((state: RootState) => state.sprites.byId);
  const allIds = useSelector((state: RootState) => state.sprites.allIds);
  const actionSets = useSelector((state: RootState) => state.editor.actionSets);
  const dispatch = useDispatch<AppDispatch>();

  const runSequenceForSprite = async (
    spriteId: string,
    sprite: Sprite,
    actions: AnimationBlock[]
  ) => {
    let currentX = sprite.x;
    let currentY = sprite.y;
    let currentRotation = sprite.rotation;

    for (const action of actions) {
      if (stopAllRef.current) break;

      const result = await executeAction(
        action,
        spriteId,
        sprite,
        actions,
        dispatch,
        currentX,
        currentY,
        currentRotation
      );

      currentX = result.x;
      currentY = result.y;
      currentRotation = result.rotation;

      if (action.id === "moveSteps") {
        for (const otherId of allIds) {
          if (otherId === spriteId) continue;

          const other = sprites[otherId];
          if (isColliding({ x: currentX, y: currentY }, other)) {
            const thisActions = actionSets[spriteId] || [];
            const otherActions = actionSets[otherId] || [];

            dispatch(setActionSet(spriteId, otherActions));
            dispatch(setActionSet(otherId, thisActions));

            console.log(
              `💥 Collision detected between ${spriteId} and ${otherId}. Actions swapped.`
            );
          }
        }
      }

      if (stopAllRef.current) break;
      await delay(500);
    }
  };

  const handlePlayAll = async () => {
    stopAllRef.current = false;
    const promises = allIds.map((id) => {
      const sprite = sprites[id];
      const actions = actionSets[id] || [];
      return runSequenceForSprite(id, sprite, actions);
    });

    await Promise.all(promises);
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      {allIds.map((id) => {
        const sprite = sprites[id];
        return (
          <DraggableSprite
            key={id}
            id={sprite.id}
            x={sprite.x}
            y={sprite.y}
            rotation={sprite.rotation}
          />
        );
      })}

      <div className="absolute bottom-4 left-4 flex space-x-4">
        <Button
          variant="secondary"
          onClick={handlePlayAll}
          className="px-4 py-2 bg-green-500 text-white rounded shadow"
        >
          Play All
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            stopAllRef.current = true;
          }}
          className="px-4 py-2 text-white rounded shadow"
        >
          Stop All
        </Button>
      </div>
    </div>
  );
}

export default PreviewArea;
