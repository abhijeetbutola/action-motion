import CatSprite from "./CatSprite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";

export default function PreviewArea() {
  const sprite = useSelector(
    (state: RootState) => state.sprites.byId["sprite1"]
  );

  if (!sprite) return null;

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute transition-transform duration-500"
        style={{
          transform: `translate(${sprite.x}px, ${sprite.y}px) rotate(${sprite.rotation}deg)`,
        }}
      >
        <CatSprite />
      </div>
      {sprite.speechBubble && (
        <div
          className="absolute bg-white border border-gray-400 rounded p-2 text-sm shadow-lg"
          style={{
            left: sprite.x + 40,
            top: sprite.y - 50,
          }}
        >
          {sprite.speechBubble.text}
        </div>
      )}
    </div>
  );
}
