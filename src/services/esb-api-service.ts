import ConfigService from '@services/config-service';
import APIService, { Request, Response } from '@services/api-service';

import { Failure, Result, Success } from '@models/result';
import ISongData from '@models/songdata';
import IQueue from '@models/queue';
import IStreamerConfiguration, { IUpdateProfile, IUpdateStreamerConfiguration } from '@models/streamer-configuration';
import IProfile from '@models/profile';
import IStreamerData from '@models/streamerdata';
import TwitchAPIService from './twitch-api-service';
import IUserData, { IUpdateUserData } from '@models/userdata';

interface ESBApiDataResponse<T> {
  code: 200;
  data: T;
}

interface ESBApiErrorResponse {
  code: 500 | 400;
  error: {
    code: string;
    message: string;
  };
}

export type ESBApiResponse<T> = Response<ESBApiDataResponse<T>, ESBApiErrorResponse>;

type Errors = 'unauthorized';

export default class ESBApiService {
  private static async sendRequest<R, D = {}>(
    url: string,
    headers: Object,
    request: Request<D>
  ): Promise<Result<ESBApiResponse<R>, Errors>> {
    const config = ConfigService.getConfig();
    return APIService.sendRequest<ESBApiResponse<R>, Errors, D>(`${config.ebs.baseUrl}${url}`, headers, request);
  }

  private static async sendSecretAuthorizedRequest<R, D = {}>(
    url: string,
    request: Request<D>
  ): Promise<Result<ESBApiResponse<R>, Errors>> {
    const config = ConfigService.getConfig();
    const auth = config.ebs.secret;
    if (!auth) {
      return Failure<Errors>('unauthorized', 'Not authorized.');
    }

    return this.sendRequest(
      url,
      {
        'x-api-key': auth,
      },
      request
    );
  }

  private static async sendTwitchAuthroizedRequest<R, D = {}>(
    url: string,
    request: Request<D>
  ): Promise<Result<ESBApiResponse<R>, Errors>> {
    const config = ConfigService.getConfig();
    const auth = config.twitch.auth;
    if (!auth) {
      return Failure<Errors>('unauthorized', 'Not authorized.');
    }

    return this.sendRequest(
      url,
      {
        Authorization: `Bearer ${auth.token}`,
      },
      request
    );
  }

  private static async sendAuthroizedRequest<R, D = {}>(
    url: string,
    request: Request<D>
  ): Promise<Result<ESBApiResponse<R>, Errors>> {
    const config = ConfigService.getConfig();
    const auth = config.twitch.auth;
    if (auth) {
      return this.sendTwitchAuthroizedRequest(url, request);
    }

    const secret = config.ebs.secret;
    if (secret) {
      return this.sendSecretAuthorizedRequest(url, request);
    }

    return Failure<Errors>('unauthorized', 'Not authorized.');
  }

  public static async loadFilteredSongs(excludeBanlist: boolean): Promise<Result<ESBApiResponse<ISongData[]>, Errors>> {
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

  public static async requestSong(songId: string): Promise<Result<ESBApiResponse<IQueue>, Errors>> {
    const channelInformationResult = await TwitchAPIService.getChannelInformation();

    // TODO: Remove this if https://github.com/twitchdev/issues/issues/455 is fixed.
    let username: string;
    if (channelInformationResult.type === 'error') {
      switch (channelInformationResult.error) {
        case 'internal':
        case 'unauthorized':
          return Failure(channelInformationResult.error, channelInformationResult.message);

        case 'helix-token-error':
          username = undefined;
          break;
      }
    }

    if (channelInformationResult.type === 'success') {
      username = channelInformationResult.data[0].broadcaster_name;
    }

    const requestResult = await this.sendAuthroizedRequest<IQueue>('/api/v1/queue', {
      method: 'post',
      data: {
        id: songId,
        username: username,
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async getQueue(): Promise<Result<ESBApiResponse<IQueue>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IQueue>('/api/v1/queue', {
      method: 'get',
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async setQueueStatus(enabled: boolean): Promise<Result<ESBApiResponse<IQueue>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IQueue>('/api/v1/queue', {
      method: 'patch',
      data: {
        enabled: enabled,
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async clearQueue(): Promise<Result<ESBApiResponse<IQueue>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IQueue>('/api/v1/queue/clear', {
      method: 'post',
      data: {},
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async announceQueueEntry(index: number): Promise<Result<ESBApiResponse<IQueue>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IQueue>('/api/v1/queue/announce', {
      method: 'post',
      data: {
        index: index,
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async updateUserData(userData: IUpdateUserData): Promise<Result<ESBApiResponse<IUserData>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IUserData>('/api/v1/userdata/', {
      method: 'patch',
      data: {
        ...userData,
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async getUserData(): Promise<Result<ESBApiResponse<IUserData>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IUserData>('/api/v1/userdata/', {
      method: 'get',
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async deleteFromQueue(index: number): Promise<Result<ESBApiResponse<IQueue>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IQueue>('/api/v1/queue', {
      method: 'delete',
      data: {
        index: index,
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async getStreamerConfiguration(): Promise<Result<ESBApiResponse<IStreamerConfiguration>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IStreamerConfiguration>('/api/v1/configuration', {
      method: 'get',
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async getStreamerData(): Promise<Result<ESBApiResponse<IStreamerData>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<IStreamerData>('/api/v1/streamerdata', {
      method: 'get',
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async updateProfile(profile: IUpdateProfile): Promise<Result<ESBApiResponse<IProfile>, Errors>> {
    const requestResult = await this.sendTwitchAuthroizedRequest<IProfile>('/api/v1/profile', {
      method: 'patch',
      data: {
        name: 'default',
        ids: Object.keys(profile.banlist),
        configuration: {
          song: {
            game: profile.game,
            unlimited: profile.unlimited,
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
    configuration: IUpdateStreamerConfiguration
  ): Promise<Result<ESBApiResponse<IStreamerConfiguration>, Errors>> {
    const requestResult = await this.sendTwitchAuthroizedRequest<IStreamerConfiguration>('/api/v1/configuration', {
      method: 'patch',
      data: {
        ...configuration,
      },
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async getGames(): Promise<Result<ESBApiResponse<string[]>, Errors>> {
    const requestResult = await this.sendAuthroizedRequest<string[]>('/api/v1/games', {
      method: 'get',
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }

  public static async regenerateSecret(): Promise<Result<ESBApiResponse<boolean>, Errors>> {
    const requestResult = await this.sendTwitchAuthroizedRequest<boolean>('/api/v1/streamerdata/secret', {
      method: 'patch',
      data: {},
    });

    if (requestResult.type === 'error') {
      return requestResult;
    }

    return Success(requestResult.data);
  }
}
