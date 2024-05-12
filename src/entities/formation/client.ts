import { IPosition } from "../position";

export interface IFormation {
  id: number;
  sequenceNumber: number;
  timeStart: string;
  timeEnd: string;
  positions: IPosition[];
}
