// utils/executeAction.ts
import { AnimationBlock } from "../animationBlocks";
import { Sprite } from "../redux/reducers/spriteReducer";
import {
  updateSprite,
  turnSprite,
  setSpeechBubble,
} from "../redux/reducers/spriteReducer";
import { AppDispatch } from "../redux/store";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const executeAction = async (
  action: AnimationBlock,
  spriteId: string,
  sprite: Sprite,
  actions: AnimationBlock[],
  dispatch: AppDispatch,
  currentX: number,
  currentY: number,
  currentRotation: number
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
      return { x: newX, y: newY, rotation: currentRotation };
    }

    case "turnClockWiseDegrees": {
      const degrees = action.params?.degrees || 0;
      dispatch(turnSprite(spriteId, degrees));
      return { x: currentX, y: currentY, rotation: currentRotation + degrees };
    }

    case "turnAntiClockWiseDegrees": {
      const degrees = action.params?.degrees || 0;
      dispatch(turnSprite(spriteId, -degrees));
      return { x: currentX, y: currentY, rotation: currentRotation - degrees };
    }

    case "goToXY": {
      const x = action.params?.x ?? currentX;
      const y = action.params?.y ?? currentY;
      dispatch(updateSprite({ id: spriteId, x, y, rotation: currentRotation }));
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
      for (let i = 0; i < times; i++) {
        for (const repeatAction of actions) {
          if (repeatAction.id !== "repeat") {
            const result = await executeAction(
              repeatAction,
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
            await delay(500);
          }
        }
      }
      return { x: currentX, y: currentY, rotation: currentRotation };
    }

    default:
      return { x: currentX, y: currentY, rotation: currentRotation };
  }
};
