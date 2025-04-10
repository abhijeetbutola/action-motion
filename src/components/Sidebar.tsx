import Icon from "./Icon";
import { looksBlocks, motionBlocks } from "../animationBlocks";
import { useDispatch } from "react-redux";
import { updateSprite } from "../redux/reducers/spriteReducer";

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
        <div key={block.id} className="flex gap-2">
          {block.label}
          {block.icon && <Icon name={block.icon} size={15} />}
        </div>
      ))}
      <div className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Move 10 steps"}
      </div>
      <div className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div className="font-bold">Looks</div>
      {looksBlocks.map((block) => (
        <div key={block.id}>
          {block.label}
          {block.icon && <Icon name={block.icon} size={15} />}
        </div>
      ))}
      <button
        onClick={() =>
          dispatch(updateSprite({ id: "sprite1", x: 10, y: 20, rotation: 15 }))
        }
      >
        Click me
      </button>
    </div>
  );
}

export default Sidebar;
