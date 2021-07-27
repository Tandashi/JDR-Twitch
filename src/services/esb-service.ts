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
  public static async loadSongs(): Promise<ESBResponse<ISongData[]>> {
    const response = await axios.get<ESBResponse<ISongData[]>>('http://localhost:3000/api/v1/songdata');
    return response.data;
  }
}
