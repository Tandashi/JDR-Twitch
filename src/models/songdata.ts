export type GameVersion =
  | 'Just Dance 2016'
  | 'Just Dance 2017'
  | 'Just Dance 2018'
  | 'Just Dance 2019'
  | 'Just Dance 2020'
  | 'Just Dance 2021'
  | 'Just Dance Unlimited';

export default interface ISongData {
  id: string;
  code_name: string;
  jdn_code_name: string;
  title: string;
  artist: string;
  game: GameVersion;
  difficulty: number;
  coaches: number;
  effort: number | null;
  image_url: string;
  wiki_url: string;
  preview_url: string | null;
}
