import axios from 'axios';
import ISongData from '@models/songdata';
import ConfigService from '@services/config-service';

interface ESBResponse<T> {
  code: number;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export default class ESBService {
  public static async loadSongs(): Promise<ESBResponse<ISongData[]>> {
    const config = ConfigService.getConfig();

    const response = await axios.get<ESBResponse<ISongData[]>>(`${config.ebs.baseUrl}/api/v1/songdata`);
    return response.data;
  }

  public static async requestSong(songId: string): Promise<ESBResponse<any>> {
    const config = ConfigService.getConfig();

    const auth = config.twitch.auth;
    if (!auth) {
      throw Error('Not Authorized');
    }

    const response = await axios.post<ESBResponse<any>>(`${config.ebs.baseUrl}/api/v1/queue/${songId}`, undefined, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  }
}
