import { Method } from 'axios';

export const API_URL = 'http://localhost:8000/api/'

export type EndpointType = {
  url: string;
  method?: Method;
};

const createApiEndpoint = (
  path: string,
  method: EndpointType['method'] = 'GET'
): EndpointType => ({
  url: `${API_URL}${path}`,
  method,
});

export const ENDPOINTS = {
  auth: createApiEndpoint('login', 'POST'),
  register: createApiEndpoint('register', 'POST'),
  user: createApiEndpoint('user', 'GET'),
  logout: createApiEndpoint('logout', 'POST'),
  refresh: createApiEndpoint('refresh', 'POST'),
  projects: createApiEndpoint('projects', 'GET'),
  teams: createApiEndpoint('teams', 'GET'),
  loadTeam: createApiEndpoint('team', 'GET'),
  editTeam: createApiEndpoint('team', 'PUT'),
  deleteTeam: createApiEndpoint('team', 'DELETE'),
  createTeam: createApiEndpoint('team', 'POST'),
  loadProject: createApiEndpoint('team', 'GET'),
  createProject: createApiEndpoint('project', 'POST'),
  deleteProject: createApiEndpoint('projects', 'DELETE'),
  loadProjectDetail: createApiEndpoint('projectDetail', 'GET'),
} as const;
