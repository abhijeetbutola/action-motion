export type LabelComponent =
  | { type: "text"; value: string }
  | { type: "input"; key: string; inputType?: "text" | "number" }
  | { type: "icon"; name: string; size?: number };

export interface AnimationBlock {
  id: string;
  labelComponents: LabelComponent[];
  params?: { [key: string]: any };
}

export const motionBlocks: AnimationBlock[] = [
  {
    id: "moveSteps",
    labelComponents: [
      { type: "text", value: "Move " },
      { type: "input", key: "steps", inputType: "number" },
      { type: "text", value: " steps" },
    ],
    params: { steps: 10 },
  },
  {
    id: "turnClockWiseDegrees",
    labelComponents: [
      { type: "text", value: "Turn " },
      { type: "input", key: "degrees", inputType: "number" },
      { type: "text", value: " degrees" },
      { type: "icon", name: "redo", size: 15 },
    ],
    params: { degrees: 90 },
  },
  {
    id: "turnAntiClockWiseDegrees",
    labelComponents: [
      { type: "text", value: "Turn " },
      { type: "input", key: "degrees", inputType: "number" },
      { type: "text", value: " degrees" },
      { type: "icon", name: "undo", size: 15 },
    ],
    params: { degrees: 90 },
  },
  {
    id: "goToXY",
    labelComponents: [
      { type: "text", value: "Go to x: " },
      { type: "input", key: "x", inputType: "number" },
      { type: "text", value: " y: " },
      { type: "input", key: "y", inputType: "number" },
    ],
    params: { x: 0, y: 0 },
  },
  {
    id: "repeat",
    labelComponents: [
      { type: "text", value: "Repeat" },
      { type: "input", key: "times", inputType: "number" },
      { type: "text", value: "times" },
    ],
    params: { times: 2 },
  },
];

export const looksBlocks: AnimationBlock[] = [
  {
    id: "say",
    labelComponents: [
      { type: "text", value: "Say " },
      { type: "input", key: "text", inputType: "text" },
      { type: "text", value: " for " },
      { type: "input", key: "seconds", inputType: "number" },
      { type: "text", value: " seconds" },
    ],
    params: { text: "", seconds: 2 },
  },
  {
    id: "think",
    labelComponents: [
      { type: "text", value: "Think " },
      { type: "input", key: "text", inputType: "text" },
      { type: "text", value: " for " },
      { type: "input", key: "seconds", inputType: "number" },
      { type: "text", value: " seconds" },
    ],
    params: { text: "", seconds: 2 },
  },
];
