import { AnimationBlock } from "../animationBlocks";
import { setActionSet } from "../redux/reducers/editorReducer";
import { Sprite } from "../redux/reducers/spriteReducer";
import {
  updateSprite,
  turnSprite,
  setSpeechBubble,
} from "../redux/reducers/spriteReducer";
import { AppDispatch } from "../redux/store";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

export const executeAction = async (
  action: AnimationBlock,
  spriteId: string,
  sprite: Sprite,
  actions: AnimationBlock[],
  dispatch: AppDispatch,
  currentX: number,
  currentY: number,
  currentRotation: number,
  spritePositions?: Record<string, { x: number; y: number; rotation: number }>,
  allIds?: string[],
  stopAllRef?: React.MutableRefObject<boolean>,
  actionSets: Record<string, AnimationBlock[]> = {}
): Promise<{ x: number; y: number; rotation: number }> => {
  switch (action.id) {
    case "moveSteps": {
      const steps = action.params?.steps || 0;
      const radians = (currentRotation * Math.PI) / 180;
      const dx = Math.cos(radians) * steps;
      const dy = Math.sin(radians) * steps;
      const newX = currentX + dx;
      const newY = currentY + dy;
      dispatch(
        updateSprite({
          id: spriteId,
          x: newX,
          y: newY,
          rotation: currentRotation,
        })
      );
      if (spritePositions) {
        spritePositions[spriteId] = {
          x: newX,
          y: newY,
          rotation: currentRotation,
        };
      }
      return { x: newX, y: newY, rotation: currentRotation };
    }

    case "turnClockWiseDegrees": {
      const degrees = action.params?.degrees || 0;
      dispatch(turnSprite(spriteId, degrees));
      const updatedRotation = currentRotation + degrees;
      if (spritePositions) {
        spritePositions[spriteId].rotation = updatedRotation;
      }
      return { x: currentX, y: currentY, rotation: updatedRotation };
    }

    case "turnAntiClockWiseDegrees": {
      const degrees = action.params?.degrees || 0;
      dispatch(turnSprite(spriteId, -degrees));
      const updatedRotation = currentRotation - degrees;
      if (spritePositions) {
        spritePositions[spriteId].rotation = updatedRotation;
      }
      return { x: currentX, y: currentY, rotation: updatedRotation };
    }

    case "goToXY": {
      const x = action.params?.x ?? currentX;
      const y = action.params?.y ?? currentY;
      dispatch(updateSprite({ id: spriteId, x, y, rotation: currentRotation }));
      if (spritePositions) {
        spritePositions[spriteId] = { x, y, rotation: currentRotation };
      }
      return { x, y, rotation: currentRotation };
    }

    case "say":
    case "think": {
      const text = action.params?.text || "";
      const seconds = parseFloat(action.params?.seconds) || 1;
      dispatch(
        setSpeechBubble(spriteId, { text, type: action.id as "say" | "think" })
      );
      await delay(seconds * 1000);
      dispatch(setSpeechBubble(spriteId, null));
      return { x: currentX, y: currentY, rotation: currentRotation };
    }

    case "repeat": {
      const times = parseInt(action.params?.times) || 1;
      const repeatActions = actions.filter((a) => a.id !== "repeat");

      for (let i = 0; i < times; i++) {
        if (stopAllRef?.current) break;

        if (!spritePositions) {
          throw new Error("spritePositions is undefined");
        }

        for (const repeatAction of repeatActions) {
          if (stopAllRef?.current) break;

          const result = await executeAction(
            repeatAction,
            spriteId,
            sprite,
            actions,
            dispatch,
            currentX,
            currentY,
            currentRotation,
            spritePositions,
            allIds
          );

          currentX = result.x;
          currentY = result.y;
          currentRotation = result.rotation;

          spritePositions[spriteId] = {
            x: currentX,
            y: currentY,
            rotation: currentRotation,
          };

          if (repeatAction.id === "moveSteps" && spritePositions && allIds) {
            for (const otherId of allIds) {
              if (otherId === spriteId) continue;
              const other = spritePositions[otherId];
              if (isColliding({ x: currentX, y: currentY }, other)) {
                console.log(
                  `💥 Collision inside repeat between ${spriteId} and ${otherId}`
                );

                const thisActions = actionSets[spriteId] || [];
                const otherActions = actionSets[otherId] || [];

                dispatch(setActionSet(spriteId, otherActions));
                dispatch(setActionSet(otherId, thisActions));
              }
            }
          }

          await delay(500);
          if (stopAllRef?.current) break;
        }
      }
      return { x: currentX, y: currentY, rotation: currentRotation };
    }

    default:
      return { x: currentX, y: currentY, rotation: currentRotation };
  }
};
