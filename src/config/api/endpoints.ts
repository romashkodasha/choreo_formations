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
  projects: createApiEndpoint('projects', 'GET'),
  teams: createApiEndpoint('teams', 'GET'),
  loadTeam: createApiEndpoint('team', 'GET'),
  editTeam: createApiEndpoint('team', 'PATCH'),
  deleteTeam: createApiEndpoint('team', 'DELETE'),
  createTeam: createApiEndpoint('teams/', 'POST'),
  createProject: createApiEndpoint('projects/', 'POST'),
  deleteProject: createApiEndpoint('project', 'DELETE'),
  loadProject: createApiEndpoint('project', 'GET'),
  editProject: createApiEndpoint('project', 'PATCH'),
} as const;
