import ISongData from '@models/songdata';

export default interface IProfile {
  name: string;
  banlist: ISongData[];
  configuration: {
    song: {
      game: string;
      unlimited: boolean;
    };
  };
}
