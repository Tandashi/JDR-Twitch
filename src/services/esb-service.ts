import axios from 'axios';

import ISongData from '@models/songdata';
import ConfigService from '@services/config-service';
import IQueue from '@models/queue';

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

export default class ESBService {
  public static async loadSongs(): Promise<ESBResponse<ISongData[]>> {
    const config = ConfigService.getConfig();

    const response = await axios.get<ESBResponse<ISongData[]>>(`${config.ebs.baseUrl}/api/v1/songdata`);
    return response.data;
  }

  public static async requestSong(songId: string): Promise<ESBResponse<IQueue>> {
    const config = ConfigService.getConfig();

    const auth = config.twitch.auth;
    if (!auth) {
      throw Error('Not Authorized');
    }

    const response = await axios.post<ESBResponse<IQueue>>(
      `${config.ebs.baseUrl}/api/v1/queue`,
      {
        id: songId,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  }
}
