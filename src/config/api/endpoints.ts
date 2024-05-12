import { Method } from 'axios';

export const API_URL = 'localhost:8080'

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
  auth: createApiEndpoint('user/auth', 'POST'),
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
