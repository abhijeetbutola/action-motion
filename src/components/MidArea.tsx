import { useState } from "react";
import { useDrop } from "react-dnd";
import { AnimationBlock } from "../animationBlocks";

const ItemTypes = {
  BLOCK: "block",
};

export default function MidArea() {
  const [actions, setActions] = useState<AnimationBlock[]>([]);
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.BLOCK,
    drop: (item: { block: AnimationBlock }, monitor) => {
      setActions((prevActions) => [...prevActions, item.block]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div className="flex-1 h-full overflow-auto">
      <h2>Mid Area</h2>
      <div
        ref={drop}
        className="flex flex-col items-center justify-center h-full"
      >
        {isOver && <p>Release to drop</p>}
        {canDrop && !isOver && <p>Drag here</p>}
        {actions.length > 0 &&
          actions.map((action) => (
            <div
              key={action.id}
              className="bg-blue-500 text-white border border-black"
            >
              {action.label}
            </div>
          ))}
      </div>
    </div>
  );
}
