import { Failure, Result, Success } from '@models/result';

import APIService, { Request, Response } from '@services/api-service';
import ConfigService from '@services/config-service';

type GeneralErrors = 'unauthorized';
type ChannelInformationErrors = GeneralErrors;

interface ChannelInformationResult {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  broadcaster_language: string;
  game_id: string;
  game_name: string;
  title: string;
  delay: number;
}

interface TwitchDataResponse<T> {
  status?: undefined;
  data: T;
}

interface TwitchErrorResponse {
  status: 401;
  error: string;
  message: string;
}

export type TwitchAPIResponse<T> = Response<TwitchDataResponse<T>, TwitchErrorResponse>;

export default class TwitchAPIService {
  private static async sendRequest<ResultData, Errors, Data = {}>(
    url: string,
    headers: Object,
    request: Request<Data>
  ): Promise<Result<ResultData, Errors>> {
    const result = await APIService.sendRequest<TwitchAPIResponse<ResultData>, Errors, Data>(
      `https://api.twitch.tv/helix${url}`,
      headers,
      request
    );

    if (result.type === 'error') {
      return result;
    }

    if (result.data.status) {
      return Failure('internal', (result.data as TwitchErrorResponse).message);
    }

    return Success((result.data as TwitchDataResponse<ResultData>).data);
  }

  public static async getChannelInformation(
    channelId?: string
  ): Promise<Result<[ChannelInformationResult], ChannelInformationErrors>> {
    const config = ConfigService.getConfig();

    if (!config.twitch.auth) {
      return Failure<GeneralErrors>('unauthorized', 'Not authorized.');
    }

    const channel = channelId ?? window.Twitch.ext.viewer.id;

    return this.sendRequest<[ChannelInformationResult], ChannelInformationErrors>(
      `/channels?broadcaster_id=${channel}`,
      {
        'client-id': config.twitch.auth.clientId,
        Authorization: `Extension ${config.twitch.auth.helixToken}`,
      },
      {
        method: 'get',
      }
    );
  }
}
