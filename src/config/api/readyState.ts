import { ENDPOINTS } from './endpoints';

// TODO: Обновлять состояние готовности по эндпойнтам
export const API_READY_STATE: Record<keyof typeof ENDPOINTS, boolean> = {
  auth: true,
  projects: false,
  teams: false,
  register: true,
  user: false,
  logout: false,
  refresh: false,
  loadTeam: false,
  editTeam: false,
  deleteTeam: false,
  createTeam: false,
  loadProject: false,
  createProject: false,
  deleteProject: false,
  loadProjectDetail: false
};