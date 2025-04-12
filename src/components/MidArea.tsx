import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { executeAction } from "../utils/executeAction";
import { AppDispatch } from "../redux/reducers";
import {
  addActionToSprite,
  removeActionFromSprite,
  updateActionParam,
} from "../redux/reducers/editorReducer";
import { AnimationBlock, LabelComponent } from "../animationBlocks";
import { RootState } from "../redux/reducers";
import Icon from "./Icon";
import Button from "./Button";

const ItemTypes = {
  BLOCK: "block",
};

export default function MidArea() {
  const [isRunning, setIsRunning] = useState(false);
  const shouldStop = useRef(false);

  const dispatch = useDispatch();

  const selectedSpriteId = useSelector(
    (state: RootState) => state.editor.selectedSpriteId
  );
  const sprite = useSelector((state: RootState) =>
    selectedSpriteId ? state.sprites.byId[selectedSpriteId] : null
  );

  const actions = useSelector((state: RootState) =>
    selectedSpriteId ? state.editor.actionSets[selectedSpriteId] || [] : []
  );

  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selectedSpriteId;

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.BLOCK,
    drop: (item: { block: AnimationBlock }) => {
      const spriteId = selectedRef.current;
      if (spriteId) {
        dispatch(addActionToSprite(spriteId, item.block));
      }
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
    if (selectedSpriteId)
      dispatch(updateActionParam(selectedSpriteId, actionIndex, key, value));
  };

  const renderBlockWithInputs = (
    action: AnimationBlock,
    index: number
  ): React.ReactNode => {
    return (
      <div>
        {action.labelComponents.map((component: LabelComponent, i) => {
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
        })}
      </div>
    );
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const runSequence = async () => {
    if (!selectedSpriteId || !sprite) return;
    setIsRunning(true);
    shouldStop.current = false;

    let currentX = sprite.x;
    let currentY = sprite.y;
    let currentRotation = sprite.rotation;

    for (const action of actions) {
      if (shouldStop.current) break;
      const result = await executeAction(
        action,
        sprite.id,
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

      if (shouldStop.current) break;
      await delay(500);
    }

    setIsRunning(false);
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      <h2 className="text-xl font-bold p-2">Mid Area</h2>

      <div
        ref={drop}
        className="flex-1 overflow-auto flex flex-col items-center border-2 border-dashed p-4"
      >
        {isOver && <p className="text-green-600">Release to drop</p>}
        {canDrop && !isOver && <p className="text-gray-500">Drag here</p>}
        {actions.map((action, index) => (
          <div
            key={`${action.id}-${index}`}
            className="relative bg-blue-500 text-white p-2 m-1 rounded flex items-center"
          >
            <Button
              variant="danger"
              onClick={() =>
                dispatch(removeActionFromSprite(selectedSpriteId!, index))
              }
              className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              ✕
            </Button>
            {renderBlockWithInputs(action, index)}
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white flex gap-2">
        <Button
          variant="secondary"
          onClick={runSequence}
          disabled={!sprite || actions.length === 0 || isRunning}
          className="px-4 py-2 disabled:opacity-50"
        >
          Run Sequence
        </Button>

        <Button
          variant="danger"
          onClick={() => {
            shouldStop.current = true;
            setIsRunning(false);
          }}
          disabled={!isRunning}
          className="px-4 py-2  disabled:opacity-50"
        >
          Stop
        </Button>
      </div>
    </div>
  );
}
