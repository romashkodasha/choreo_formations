import { IMemberServer } from "entities/member";

export interface IPositionServer {
    id: number;
    member: IMemberServer;
    positionX: number;
    positionY: number;
  }
  