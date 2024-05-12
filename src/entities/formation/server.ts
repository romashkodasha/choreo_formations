import { IPositionServer } from "../position";

export interface IFormationServer {
    id: number;
    sequenceNumber: number;
    timeStart: string;
    timeEnd: string;
    positions: IPositionServer[];
  }
  