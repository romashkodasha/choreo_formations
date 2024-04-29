import { IMember } from './client';
import { IMemberServer } from './server';

export const normalizeMember = (data: IMemberServer): IMember => {
  return {
    id: data.id,
    color: data.color,
    name: data.name,
  };
};
