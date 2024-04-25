import { AxiosResponse } from 'axios';

export type ErrorResponse = {
  code: string;
} & AxiosResponse;

export interface ExtendedErrorResponse {
  isError: true;
  isCancelled: boolean;
}
