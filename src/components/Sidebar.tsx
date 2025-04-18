import Icon from "./Icon";
import { looksBlocks, motionBlocks } from "../animationBlocks";
import { useDispatch } from "react-redux";
import DraggableBlock from "./DraggableBlock";

function Sidebar() {
  const dispatch = useDispatch();

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When this sprite clicked"}
      </div>
      <div className="font-bold"> {"Motion"} </div>
      {motionBlocks.map((block) => (
        <DraggableBlock key={block.id} block={block} />
      ))}

      <div className="font-bold">Looks</div>
      {looksBlocks.map((block) => (
        <DraggableBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

export default Sidebar;
