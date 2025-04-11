// src/MidArea.tsx
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { AnimationBlock, LabelComponent } from "../animationBlocks";
import {
  updateSprite,
  turnSprite,
  setSpeechBubble,
} from "../redux/reducers/spriteReducer";
import { RootState } from "../redux/reducers"; // adjust the path as needed
import Icon from "./Icon";

const ItemTypes = {
  BLOCK: "block",
};

export default function MidArea() {
  const [actions, setActions] = useState<AnimationBlock[]>([]);
  const dispatch = useDispatch();

  // Assuming sprite1 is the sprite to animate.
  const sprite = useSelector(
    (state: RootState) => state.sprites.byId["sprite1"]
  );

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.BLOCK,
    drop: (item: { block: AnimationBlock }) => {
      setActions((prev) => [...prev, item.block]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleParamChange = (
    actionIndex: number,
    key: string,
    value: number | string
  ) => {
    setActions((prev) => {
      const updated = [...prev];
      const updatedParams = { ...updated[actionIndex].params, [key]: value };
      updated[actionIndex] = { ...updated[actionIndex], params: updatedParams };
      return updated;
    });
  };

  // Render each block by iterating through labelComponents.
  const renderBlockWithInputs = (
    action: AnimationBlock,
    index: number
  ): React.ReactNode => {
    return action.labelComponents.map((component: LabelComponent, i) => {
      switch (component.type) {
        case "text":
          return (
            <span key={i} className="inline-block">
              {component.value}
            </span>
          );
        case "input":
          return (
            <input
              key={i}
              type={component.inputType || "number"}
              className="w-16 mx-1 border rounded px-1 text-black"
              value={action.params?.[component.key] ?? ""}
              onChange={(e) =>
                handleParamChange(index, component.key, e.target.value)
              }
            />
          );
        case "icon":
          return (
            <Icon
              key={i}
              name={component.name}
              size={component.size ?? 15}
              className="inline-block mx-1"
            />
          );
        default:
          return null;
      }
    });
  };

  // Helper function to delay execution.
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // runSequence executes each action sequentially.
  const runSequence = async () => {
    if (!sprite) return;

    // Use local variables to track the current state of the sprite.
    let currentX = sprite.x;
    let currentY = sprite.y;
    let currentRotation = sprite.rotation;

    for (const action of actions) {
      switch (action.id) {
        case "moveSteps": {
          const steps = action.params?.steps || 0;
          // Calculate movement based on the current rotation.
          const radians = (currentRotation * Math.PI) / 180;
          const dx = Math.cos(radians) * steps;
          const dy = Math.sin(radians) * steps;
          currentX += dx;
          currentY += dy;
          // Update the sprite with the new position.
          dispatch(
            updateSprite({
              id: sprite.id,
              x: currentX,
              y: currentY,
              rotation: currentRotation,
            })
          );
          break;
        }
        case "turnClockWiseDegrees": {
          const degrees = action.params?.degrees || 0;
          // Dispatch a turn action to update rotation.
          dispatch(turnSprite(sprite.id, degrees));
          currentRotation += degrees; // update local variable as well
          break;
        }
        case "turnAntiClockWiseDegrees": {
          const degrees = action.params?.degrees || 0;
          dispatch(turnSprite(sprite.id, -degrees));
          currentRotation -= degrees;
          break;
        }
        case "goToXY": {
          const x = action.params?.x ?? currentX;
          const y = action.params?.y ?? currentY;
          currentX = x;
          currentY = y;
          dispatch(
            updateSprite({
              id: sprite.id,
              x,
              y,
              rotation: currentRotation,
            })
          );
          break;
        }
        case "say":
        case "think": {
          // For looks blocks, show the speech bubble.
          const text = action.params?.text || "";
          // Convert seconds to milliseconds.
          const seconds = parseFloat(action.params?.seconds) || 1;
          dispatch(
            setSpeechBubble(sprite.id, {
              text,
              type: action.id as "say" | "think",
            })
          );
          // Wait for the specified duration.
          await delay(seconds * 1000);
          // Clear the speech bubble.
          dispatch(setSpeechBubble(sprite.id, null));
          break;
        }
        default:
          break;
      }
      // Wait between actions so each transition is visible.
      await delay(500);
    }
  };

  return (
    <div className="flex-1 h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4">Mid Area</h2>
      <div
        ref={drop}
        className="flex flex-col items-center justify-center h-full border-2 border-dashed p-4"
      >
        {isOver && <p className="text-green-600">Release to drop</p>}
        {canDrop && !isOver && <p className="text-gray-500">Drag here</p>}
        {actions.map((action, index) => (
          <div
            key={`${action.id}-${index}`}
            className="bg-blue-500 text-white p-2 m-1 rounded flex items-center"
          >
            {renderBlockWithInputs(action, index)}
          </div>
        ))}
      </div>
      <button
        onClick={runSequence}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Run Sequence
      </button>
    </div>
  );
}
