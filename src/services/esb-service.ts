import axios, { AxiosError } from 'axios';

import { Failure, Result, Success } from '@models/result';
import ISongData from '@models/songdata';
import ConfigService from '@services/config-service';
import IQueue from '@models/queue';
import IStreamerConfiguration from '@models/streamer-configuration';
import IProfile from '@models/profile';
import IStreamerData from '@models/streamerdata';

interface ESBDataResponse<T> {
  code: 200;
  data: T;
}

interface ESBErrorResponse {
  code: 500 | 400;
  error: {
    code: string;
    message: string;
  };
}

export type ESBResponse<T> = ESBDataResponse<T> | ESBErrorResponse;

type Errors = 'unauthorized';

type NonDataRequest = {
  method: 'get';
};

type DataRequest<T> = {
  method: 'post' | 'patch';
  data: T;
};

type Request<T> = NonDataRequest | DataRequest<T>;

export default class ESBService {
  private static async sendAuthroizedRequest<R, D = {}>(
    url: string,
    request: Request<D>
  ): Promise<Result<ESBResponse<R>, Errors>> {
    const config = ConfigService.getConfig();

    const auth = config.twitch.auth;
    if (!auth) {
      return Failure<Errors>('unauthorized', 'Not authorized.');
    }

    try {
      let response;
      switch (request.method) {
        case 'get':
          response = await axios[request.method]<ESBResponse<R>>(`${config.ebs.baseUrl}${url}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          break;
        case 'patch':
        case 'post':
          response = await axios[request.method]<ESBResponse<R>>(`${config.ebs.baseUrl}${url}`, request.data, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          break;
      }

      return Success(response.data);
    } catch (e) {
      const error = e as AxiosError<ESBErrorResponse>;
      return Success(error.response.data);
    }
  }

  public static async loadFilteredSongs(excludeBanlist: boolean): Promise<Result<ESBResponse<ISongData[]>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<ISongData[]>(
      `/api/v1/songdata/filtered?excludeBanlist=${excludeBanlist}`,
      {
        method: 'get',
      }
    );

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async requestSong(songId: string): Promise<Result<ESBResponse<IQueue>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IQueue>('/api/v1/queue', {
      method: 'post',
      data: {
        id: songId,
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async getStreamerData(): Promise<Result<ESBResponse<IStreamerData>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IStreamerData>('/api/v1/streamerdata', {
      method: 'get',
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async updateProfile(
    ids: string[],
    game: string,
    unlimited: boolean
  ): Promise<Result<ESBResponse<IProfile>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IProfile>('/api/v1/profile', {
      method: 'patch',
      data: {
        name: 'default',
        ids: ids,
        configuration: {
          song: {
            game: game,
            unlimited: unlimited,
          },
        },
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async updateConfiguration(
    chatIntegration: boolean,
    perUser: number,
    duplicates: boolean
  ): Promise<Result<ESBResponse<IStreamerConfiguration>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IStreamerConfiguration>('/api/v1/configuration', {
      method: 'patch',
      data: {
        chatIntegration: {
          enabled: chatIntegration,
        },
        requests: {
          perUser: perUser,
          duplicates: duplicates,
        },
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async getGames(): Promise<Result<ESBResponse<string[]>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<string[]>('/api/v1/games', {
      method: 'get',
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async regenerateSecret(): Promise<Result<ESBResponse<boolean>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<boolean>('/api/v1/streamerdata/secret', {
      method: 'patch',
      data: {},
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }
}
