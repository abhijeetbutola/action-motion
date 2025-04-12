import { useDrag } from "react-dnd";
import { AnimationBlock, LabelComponent } from "../animationBlocks";
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

  const renderPreview = () => {
    return block.labelComponents.map((component: LabelComponent, index) => {
      switch (component.type) {
        case "text":
          return (
            <span key={index} className="inline-block">
              {component.value}
            </span>
          );
        case "input":
          return (
            <span
              key={index}
              className="inline-block border-b border-dotted px-1"
            >
              {block.params && block.params[component.key] !== undefined
                ? block.params[component.key]
                : "____"}
            </span>
          );
        case "icon":
          return (
            <Icon
              key={index}
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

  return (
    <div
      ref={drag}
      className={`p-2 bg-blue-500 text-white m-1 rounded cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {renderPreview()}
    </div>
  );
}

export default DraggableBlock;
