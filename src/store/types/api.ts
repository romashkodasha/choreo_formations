import { AxiosResponse } from 'axios';

export type ErrorResponse = {
  code: string;
} & AxiosResponse;
