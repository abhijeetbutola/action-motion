import CatSprite from "./CatSprite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";

export default function PreviewArea() {
  const sprite = useSelector(
    (state: RootState) => state.sprites.byId["sprite1"]
  );

  if (!sprite) return null;

  return (
    <div className="relative flex-none h-full p-2">
      <div
        className="absolute transition-transform duration-200 overflow-visible"
        style={{
          transform: `translate(${sprite.x}px,${sprite.y}px) rotate(${sprite.rotation}deg)`,
        }}
      >
        <CatSprite />
      </div>
    </div>
  );
}
