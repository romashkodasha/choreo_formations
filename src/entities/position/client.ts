import { IMember } from "entities/member";

export interface IPosition {
  id: number;
  member: IMember;
  positionX: number;
  positionY: number;
}
