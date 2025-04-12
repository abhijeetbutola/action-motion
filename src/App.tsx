import React from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import SpritePanel from "./components/SpritePanel";

export default function App() {
  return (
    <div className="bg-blue-100 pt-6 font-sans box-border h-screen">
      <div className="h-full overflow-hidden flex flex-row">
        <div className="w-2/3 h-full overflow-hidden flex bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar />
          <MidArea />
        </div>

        <div className="w-1/3 h-full overflow-hidden flex flex-col bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea />
          <SpritePanel />
        </div>
      </div>
    </div>
  );
}
