import axios from 'axios';
import ISongData from '@models/songdata';

interface ESBResponse<T> {
  code: number;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export default class ESBService {
  private static EBS_URL = 'https://jd.tandashi.de/api/v1/songdata';

  public static async loadSongs(): Promise<ESBResponse<ISongData[]>> {
    const response = await axios.get<ESBResponse<ISongData[]>>(this.EBS_URL);
    return response.data;
  }
}
