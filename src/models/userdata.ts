import ISongData from './songdata';

export default interface IUserData {
  favouriteSongs: ISongData[];
}

export interface IUpdateUserData {
  favouriteSongs: string[];
}
