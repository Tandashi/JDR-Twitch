import IQueue from '@models/queue';
import { Response } from '@services/api-service';
import socketIO, { Socket } from 'socket.io-client';
import ConfigService from './config-service';
import Logger from './logging';

interface ESBSocketIODataResponse<T> {
  code: 200;
  data: T;
}

interface ESBSocketIOErrorResponse {
  code: 500 | 400;
  error: {
    code: string;
    message: string;
  };
}

export type ESBSocketIOResponse<T> = Response<ESBSocketIODataResponse<T>, ESBSocketIOErrorResponse>;

type ESBSocketIOListenEvent = 'v1/queue:updated' | 'v1/next-up:set' | 'v1/next-up:cleared';
type ESBSocketIOEmitEvent = 'v1/queue:get' | 'v1/next-up:clear';

export default class ESBSocketIOService {
  private static io: Socket;

  public static registerHandler<D>(
    event: ESBSocketIOListenEvent | 'connected' | 'disconnected',
    callback: (data: D) => void
  ): void {
    this.io.on(event, callback);
  }

  public static clearUpNext(): void {
    this.emit('v1/next-up:clear');
  }

  public static getQueue(): Promise<ESBSocketIOResponse<IQueue>> {
    return new Promise((resolve) => {
      this.emit('v1/queue:get', {}, resolve);
    });
  }

  private static emit<D, R>(
    event: ESBSocketIOEmitEvent,
    data?: D,
    callback?: (response: ESBSocketIOResponse<R>) => void
  ): void {
    this.io.emit(event, data || {}, callback || (() => {}));
  }

  public static connect(method: 'jwt' | 'secret', token: string): void {
    const config = ConfigService.getConfig();
    this.io = socketIO(`${config.ebs.baseUrl}/`, {
      path: '/socket.io/',
      auth: {
        method: method,
        token: token,
      },
    });

    this.registerHandler('connected', () => Logger.info('Socket connected'));
    this.registerHandler('disconnected', () => Logger.info('Socket disconnected'));

    this.io.connect();
  }
}
