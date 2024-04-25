import { EndpointType } from '../../../config/api/endpoints';

export type EndpointsType = Record<string, EndpointType> & {
  auth: EndpointType;
  getUser?: EndpointType;
  flag?: EndpointType;
};