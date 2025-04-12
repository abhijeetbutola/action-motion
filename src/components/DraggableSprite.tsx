import React from "react";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { updateSprite } from "../redux/reducers/spriteReducer";
import CatSprite from "./CatSprite";
import { RootState } from "../redux/reducers";

const ItemTypes = {
  SPRITE: "sprite",
};

interface DraggableSpriteProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

const DraggableSprite: React.FC<DraggableSpriteProps> = ({
  id,
  x,
  y,
  rotation,
}) => {
  const dispatch = useDispatch();

  const speechBubble = useSelector(
    (state: RootState) => state.sprites.byId[id]?.speechBubble
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.SPRITE,
      item: { id, initialX: x, initialY: y },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          // Calculate new position by adding delta to the original position.
          const newX = x + delta.x;
          const newY = y + delta.y;
          // Dispatch an update to Redux with the new coordinates.
          dispatch(updateSprite({ id, x: newX, y: newY, rotation }));
        }
      },
    }),
    [id, x, y, rotation, dispatch]
  );

  return (
    <div
      ref={drag}
      className="absolute cursor-move transition-transform duration-500"
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {speechBubble && (
        <div
          className={`${
            speechBubble.type === "say" ? "bg-white" : "bg-gray-300 italic"
          } text-black text-xs px-2 py-1 rounded shadow mb-1 absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap`}
        >
          {speechBubble.text}
        </div>
      )}
      <CatSprite />
    </div>
  );
};

export default DraggableSprite;
