import { useDrag } from "react-dnd";
import { AnimationBlock } from "../animationBlocks";
import Icon from "./Icon";

type DraggableBlockProps = {
  block: AnimationBlock;
};

const ItemTypes = {
  BLOCK: "block",
};

function DraggableBlock({ block }: DraggableBlockProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BLOCK,
    item: { block },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 bg-blue-500 text-white m-1 rounded cursor-pointer ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {block.label}
      {block.icon && <Icon name={block.icon} size={15} />}
    </div>
  );
}

export default DraggableBlock;
