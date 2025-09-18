
export enum WheelchairStatus {
  Available = 'Available',
  InTransit = 'In Transit',
  Charging = 'Charging',
  NeedsAssistance = 'Needs Assistance',
}

export interface Point {
  x: number;
  y: number;
}

export interface Wheelchair {
  id: string;
  position: Point;
  destination: Point | null;
  path: Point[];
  status: WheelchairStatus;
  battery: number; // Percentage
  speed: number;
}

export interface Obstacle {
  id: string;
  position: Point;
}
