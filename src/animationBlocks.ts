export interface AnimationBlock {
  id: string;
  label: string;
  params?: { [key: string]: any };
  icon?: string;
}

export const motionBlocks: AnimationBlock[] = [
  {
    id: "moveSteps",
    label: "Move ____ steps",
    params: { steps: 10 },
  },
  {
    id: "turnClockWiseDegrees",
    label: "Turn ____ degrees",
    params: { degrees: 90 },
    icon: "redo",
  },
  {
    id: "turnAntiClockWiseDegrees",
    label: "Turn ____ degrees",
    params: { degrees: 90 },
    icon: "undo",
  },
  {
    id: "goToXY",
    label: "Go to x: ___ y: ____",
    params: { x: 0, y: 0 },
  },
];

export const looksBlocks: AnimationBlock[] = [
  {
    id: "say",
    label: "Say ____ for ____ seconds",
    params: { text: "", seconds: 2 },
  },
  {
    id: "think",
    label: "Think ____ for ____ seconds",
    params: { text: "", seconds: 2 },
  },
];
