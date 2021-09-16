import { Response } from '@services/api-service';
import socketIO, { Socket } from 'socket.io-client';
import ConfigService from './config-service';

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

type ESBSocketIOListenEvent = 'world';
type ESBSocketIOEmitEvent = 'hello';

export default class ESBSocketIOService {
  private static io: Socket;

  public static registerHandler(event: ESBSocketIOListenEvent, callback: () => void): void {
    this.io.on(event, callback);
  }

  public static emit(event: ESBSocketIOEmitEvent, data?: any): void {
    this.io.emit(event, data);
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

    // client-side
    this.io.on('connect', () => {});

    this.io.connect();
  }
}
