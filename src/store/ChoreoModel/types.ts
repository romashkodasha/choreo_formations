export type FormationModel = {
  sequenceNumber: number;
  positions: PositionModel[];
  timeStart: string;
  timeEnd: string;
};

export type PositionModel = {
  dancerID: number;
  position_x: number;
  position_y: number;
};

export type DancerType = {
  dancerID: number;
  name: string;
  color: string;
};
