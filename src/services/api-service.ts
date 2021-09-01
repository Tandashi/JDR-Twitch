import axios, { AxiosError } from 'axios';

import { Result, Success } from '@models/result';

type NonDataRequest = {
  method: 'get';
};

type DataRequest<T> = {
  method: 'post' | 'patch' | 'delete';
  data: T;
};

export type Request<T> = NonDataRequest | DataRequest<T>;
export type Response<S, E> = S | E;

export default class APIService {
  public static async sendRequest<Response, Errors, Data = {}>(
    url: string,
    headers: Object,
    request: Request<Data>
  ): Promise<Result<Response, Errors>> {
    try {
      let response;
      switch (request.method) {
        case 'get':
          response = await axios[request.method]<Response>(url, {
            headers: headers,
          });
          break;
        case 'patch':
        case 'post':
          response = await axios[request.method]<Response>(url, request.data, {
            headers: headers,
          });
          break;
        case 'delete':
          response = await axios[request.method]<Response>(url, {
            headers: headers,
            data: request.data,
          });
          break;
      }

      return Success(response.data);
    } catch (e) {
      const error = e as AxiosError<Response>;
      return Success(error.response.data);
    }
  }
}
