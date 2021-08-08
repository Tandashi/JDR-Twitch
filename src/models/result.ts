export interface SuccessResult<T> {
  type: 'success';
  data: T;
}

export interface FailureResult<T> {
  type: 'error';
  error: T;
  message: string;
}

export function Success<T>(data: T): SuccessResult<T> {
  return {
    type: 'success',
    data: data,
  };
}

export function Failure<T>(error: T | 'internal', message: string): FailureResult<T | 'internal'> {
  return {
    type: 'error',
    error: error,
    message: message,
  };
}

export type Result<D, E = never> = SuccessResult<D> | FailureResult<E | 'internal'>;
