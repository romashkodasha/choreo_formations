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
} as const;
